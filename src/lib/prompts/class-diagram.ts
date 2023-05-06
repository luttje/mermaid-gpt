/**
 * text-davinci-003 prompt for generating Class Diagram code
 */
export const prompt = `You will generate Class Diagram code for a system description. It should be formatted like these examples:

System description: Ducks, Fish and Zebras are all animals. All animals have an age and gender, they can have a mate and can return if they are a mammal. Ducks have a beak color, can swim and quack. Fish have a size (in feet) and can eat. Zebras can run and are wild.
Class Diagram code:
classDiagram
  note "From Duck till Zebra"
  Animal <|-- Duck
  note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"
  Animal <|-- Fish
  Animal <|-- Zebra
  Animal : +int age
  Animal : +String gender
  Animal : +isMammal()
  Animal : +mate()
  class Duck{
    +String beakColor
    +swim()
    +quack()
  }
  class Fish{
    -int sizeInFeet
    -canEat()
  }
  class Zebra{
    +bool is_wild
    +run()
  }
##
System description: A student has a name and id which is registered on their id-card. A student has only 1 id card. They can own multiple bikes (or none). The bike is registered to a student, other code should be able to get the student id from the bike.
Class Diagram code:
classDiagram
  Student "1" --o "1" IdCard : carries
  Student "1" --o "0..*" Bike : owns
  class Student {
    -IdCard idCard
  }
  class IdCard{
    -int id
    -String name
  }
  class Bike{
    -int id
    -String name 
    +int studentId
  }
##
System description: A user is either a customer or admin. Both of those have a name and email. A customer has a phone number and an address. A customer can have multiple orders. An order has an id, date and a status.
Class Diagram code:
classDiagram
  User <|-- Customer
  User <|-- Admin
  User : +String name
  User : +String email
  Customer "1" --o "0..*" Order : has
  class Customer{
    +String phone
    +String address
  }
  class Order{
    +int id
    +Date date
    +String status
  }

As seen with the Admin class above when a class has no explicit fields or methods, the empty 'class Admin{}' is omitted.
The first statements in a class diagram define the base classes and class relationships. The relationship types are defined as <first-class> <cardinality arrow> <second-class> [: "relationship-label"].

Use only these cardinality symbols for the cardinality arrow:
  <|--  Inheritance
  *--  Composition
  o--  Aggregation
  <--  Association
  --  Link (Solid)
  <..  Dependency
  <|..  Realization
  ..  Link (Dashed)

Lines marked .. are dashed lines, lines marked -- are solid lines.

The arrows can also be reversed to indicate the opposite direction of the relationship. For example, classA <|-- classB is the same as classB --|> classA.

Multiplicity notations are placed near the end of an association. The different cardinality options are :
  1  Only 1
  0..1  Zero or One
  1..*  One or more
  *  Many
  n  Exactly n
  0..n  Zero to n
  1..n  One to n

Cardinality can be easily defined by placing the text option within quotes " before or after a given arrow. For example: <first-class> "cardinality1" <cardinality arrow> "cardinality2" <second-class> [: "relationship-label"]. For example:
classDiagram
    Customer "1" --> "*" Ticket
    Student "1" --> "1..*" Course
    Galaxy --> "many" Star : Contains
  
You will be given a system description and you must generate Class Diagram code for it in the same format. Adhere to the same format seen in the provided examples.
Return the Class Diagram code for this system description, give NO explanation or introduction.

System description: """`