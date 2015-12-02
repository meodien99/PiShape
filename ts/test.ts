/**
 * Created by madcat on 11/11/15.
 */
class Student {
    fullname : string;
    constructor(public firstname, public middleinitial, public lastname) {
        this.fullname = firstname + " " + middleinitial + " " + lastname;
    }
}

interface Person {
    firstname : string;
    lastname : string;
}

function greeter(person: Person) {
    return "Hello " + person.firstname + " " + person.lastname;
}


var user = new Student("Ha", "M", "Na");

console.log(user);
