// Завдання 1: Змінні та математичні операції
const a = 10;
const b = 5;

console.log("--- Завдання 1 ---");
console.log("Сума:", a + b);
console.log("Різниця:", a - b);
console.log("Множення:", a * b);
console.log("Ділення:", a / b);

// Завдання 2: Робота з рядками
const firstName = "Іван";
const lastName = "Іванов";
const fullName = `${firstName} ${lastName}`;

console.log("\n--- Завдання 2 ---");
console.log(`Привіт, ${fullName}!`);

// Завдання 3: Умовний оператор (if/else)
let age = 20;

console.log("\n--- Завдання 3 ---");
if (age >= 18) {
    console.log("Доступ дозволено");
} else {
    console.log("Доступ заборонено");
}

// Завдання 4: Цикл for
console.log("\n--- Завдання 4 ---");
for (let i = 1; i <= 10; i++) {
    console.log(i);
}

// Завдання 5: Функції
console.log("\n--- Завдання 5 ---");
function square(number) {
    return number * number;
}
const result = square(5);
console.log("Квадрат числа 5 дорівнює:", result);

// Завдання 6: Робота з масивами
console.log("\n--- Завдання 6 ---");
let fruits = ["Яблуко", "Банан", "Апельсин"];
fruits.push("Манго");
console.log("Список фруктів:", fruits);