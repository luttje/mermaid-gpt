import{w as s}from"./paths.4765ea46.js";const d=`You will generate ERDiagram code for a system description. It should be formatted like this example:

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

System description: """`;function m(){const{subscribe:a,set:e,update:c}=s(null);return{subscribe:a,generateDiagram:async(o,n)=>{const t={model:"text-davinci-003",prompt:d+n+`"""
ERDiagram code: `,max_tokens:2e3,top_p:.1};console.log({promptBody:t});const r=await fetch("https://api.openai.com/v1/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify(t)});console.log(r);const i=(await r.json()).choices[0].text.trim(`
`);e(i)},reset:()=>e(null)}}const g=m();export{g as d};
