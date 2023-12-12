const express = require('express');
const { PrismaClient } = require('@prisma/client');

// Inicjalizacja klienta Prisma
const prisma = new PrismaClient();
const app = express();

// Ustawienie obsługi formatu JSON
app.use(express.json());

// Obsługa CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Testowe API z obsługą błędów
app.get('/test', (req, res, next) => {
    try {
        // Testowy endpoint bez błędu
        res.status(200).json({ message: 'Success!' });
    } catch (err) {
        // Obsługa błędów
        next(err);
    }
});

// Pobranie wszystkich użytkowników
app.get('/users', async (req, res, next) => {
    try {
        // Pobranie wszystkich użytkowników z bazy danych
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err) {
        // Obsługa błędów
        next(err);
    }
});

// Pobranie użytkownika po ID
app.get('/users/:id', async (req, res, next) => {
    try {
        // Pobranie pojedynczego użytkownika z bazy danych na podstawie ID
        const user = await prisma.user.findUnique({
            where: { id: Number(req.params.id) },
        });
        res.status(200).json(user);
    } catch (err) {
        // Obsługa błędów
        next(err);
    }
});

// Utworzenie nowego użytkownika
app.post('/users', async (req, res, next) => {
    try {
        // Utworzenie nowego użytkownika na podstawie danych przekazanych w ciele żądania
        const user = await prisma.user.create({
            data: { ...req.body },
        });
        res.status(201).json(user);
    } catch (err) {
        // Obsługa błędów
        next(err);
    }
});

// Aktualizacja danych użytkownika
app.put('/users/:id', async (req, res, next) => {
    try {
        // Aktualizacja danych użytkownika na podstawie ID
        const user = await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: { ...req.body },
        });
        res.status(200).json(user);
    } catch (err) {
        // Obsługa błędów
        next(err);
    }
});

// Usunięcie użytkownika
app.delete('/users/:id', async (req, res, next) => {
    try {
        // Usunięcie użytkownika na podstawie ID
        const user = await prisma.user.delete({
            where: { id: Number(req.params.id) },
        });
        res.status(200).json(user);
    } catch (err) {
        // Obsługa błędów
        next(err);
    }
});

// Uruchomienie serwera
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
