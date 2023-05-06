/**
 * text-davinci-003 prompt for generating Entityn Relationship Diagram code
 */
export const prompt = `You will generate ERDiagram code for a system description. It should be formatted like these examples:

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

Each relationship statement in the ERD diagram code consists of the following parts: <first-entity> <cardinality arrow> <second-entity> [: "relationship-label"]

Use only these cardinality symbols for the cardinality arrow:
  |o o| Zero or one
  || || Exactly one
  }o o{ Zero or more (no upper limit)
  }| |{ One or more (no upper limit)

You will be given a system description and you must generate ER diagram code for it in the same format. Adhere to the same format seen in the provided examples.
Return the ER diagram code for this system description, give NO explanation or introduction.

System description: """`;