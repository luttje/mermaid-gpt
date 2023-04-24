import { writable } from 'svelte/store';

// Too long and inconsistent results:
/*
const promptLong = `Generate Entity Relationship diagram code for a given system description. The diagram code should be formatted like this:
erDiagram
  CAR ||--o{ NAMED-DRIVER : "allows"
  CAR {
    string registrationNumber
    string make
    string model
  }
  PERSON ||--o{ NAMED-DRIVER : "is"
  PERSON {
    string firstName
    string lastName
    int age
  }

Or like this:
erDiagram
  CAR ||--o{ NAMED-DRIVER : "allows"
  CAR {
    string registrationNumber PK
    string make
    string model
    string[] parts
  }
  PERSON ||--o{ NAMED-DRIVER : "is"
  PERSON {
    string driversLicense PK "The license #"
    string(99) firstName "Only 99 characters are allowed"
    string lastName
    string phone UK
    int age
  }
  NAMED-DRIVER {
    string carRegistrationNumber PK, FK
    string driverLicence PK, FK
  }
  MANUFACTURER only one to zero or more CAR : "makes"

Each statement consists of the following parts: <first-entity> [<relationship> <second-entity> : "<relationship-label>"]
Where:
  first-entity is the name of an entity. Names must begin with an alphabetic character and may also contain digits, hyphens, and underscores.
  relationship describes the way that both entities inter-relate. See below.
  second-entity is the name of the other entity.
  relationship-label describes the relationship from the perspective of the first entity.

For example:
  PROPERTY ||--|{ ROOM : "contains"

Identify the entities and relationships between them. The relationship part of each statement can be broken down into three sub-components:
  the cardinality of the first entity with respect to the second,
  whether the relationship confers identity on a 'child' entity
  the cardinality of the second entity with respect to the first

Relationships may be classified as either identifying (e.g: CAR ||--o{ NAMED-DRIVER : "allows") or non-identifying (e.g: PERSON }|..|{ CAR : "driver") and these are rendered with either solid or dashed lines respectively.  

Attributes are defined for entities by specifying the entity name followed by a block containing multiple type name pairs, where a block is delimited by an opening { and a closing }. 
Attributes may also have a key or comment defined. Keys can be PK, FK or UK, for Primary Key, Foreign Key or Unique Key. To specify multiple key constraints on a single attribute, separate them with a comma (e.g., PK, FK).. A comment is defined by double quotes at the end of an attribute. Comments themselves cannot have double-quote characters in them.
Whenever a table has a relationship you should add a FK attribute to the appropriate entity. For example, if a PERSON ||--o{ CAR relationship exists, then the CAR entity should have a FK attribute called personId. This is the primary key of the PERSON entity.
Primary Keys should be defined for each entity. They should be named id and be of type int, unless a better name or type is obvious.
  
This table describes the possible cardinalities:
  left right Meaning
  |o o| Zero or one
  || || Exactly one
  }o o{ Zero or more (no upper limit)
  }| |{ One or more (no upper limit)

Generate code in the provided format for this system description. Give NO explanation or introduction. Adhere to the same format seen in the provided examples: `;
*/

// More stable results:
const prompt = `You will generate ERDiagram code for a system description. It should be formatted like this example:

System description: A property contains one or more rooms and a room is always contained in a property. Both a property and a room can have a name.
ERDiagram code:
erDiagram
  PROPERTY ||--|{ ROOM : "contains"
  PROPERTY {
    int id PK
    string name
  }
  ROOM {
    int id PK
    string name
    int propertyId FK
  }
##
System description: There are two entities: cars and persons. Cars have a registration number, model and make. Persons have attributes sensible to humans. A person can be the driver of many cars and a car can have no or many drivers. When a person is registered to a car, they are called a named driver. A named driver always belongs to a car and a person. 
ERDiagram code:
erDiagram
  CAR ||--o{ NAMED-DRIVER : "allows"
  CAR {
    string registrationNumber PK
    string make
    string model
  }
  PERSON ||--o{ NAMED-DRIVER : "is"
  PERSON {
    int id PK
    string firstName
    string lastName
    int age
  }
  NAMED-DRIVER {
    string carRegistrationNumber PK, FK
    int personId PK, FK
  }
##
System description: A customer can place orders for their sector and have it delivered to an address. A customer has a name and is identified by a unique number. A customer can be associated with many orders, and an order can be associated with only one customer. An order must contain one or more items unique to that order. The items in the order also contain information on the product price and quantity.
ERDiagram code:
erDiagram
  CUSTOMER ||--o{ ORDER : "places"
  CUSTOMER {
    string customerNumber PK
    string name
    string sector
  }
  ORDER ||--|{ LINE-ITEM : "contains"
  ORDER {
    int orderNumber PK
    string deliveryAddress
  }
  LINE-ITEM {
    string productCode
    int quantity
    float pricePerUnit
    int orderNumber FK
  }

Each statement in the ERD diagram code consists of the following parts: <first-entity> [<relationship> <second-entity> : "<relationship-label>"]

Use only these cardinality symbols:
  |o o| Zero or one
  || || Exactly one
  }o o{ Zero or more (no upper limit)
  }| |{ One or more (no upper limit)

You will be given a system description and you must generate ER diagram code for it in the same format. Adhere to the same format seen in the provided examples.
Return the ER diagram code for this system description, give NO explanation or introduction.

System description: """`;

function createDiagram() {
	const { subscribe, set, update } = writable<string | null>(null);

	return {
    subscribe,
    generateDiagram: async (apiKey: string, diagramDescription: string) => {
      const promptBody = {
        model: 'text-davinci-003',
        prompt: prompt + diagramDescription + '"""\nERDiagram code: ',
        max_tokens: 2000,
        top_p: 0.1,
      };

      console.log({
        promptBody
      });

      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(promptBody)
      });

      console.log(response);
      const data = await response.json();
      const diagram = data.choices[0].text.trim('\n');
      set(diagram);
    },
		reset: () => set(null)
	};
}

export const diagram = createDiagram();