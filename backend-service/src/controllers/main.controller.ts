const express = require('express');
import { Request, Response } from 'express';

const getAllItems = (req: Request, res: Response): void => {
  // Logic to get all items
  res.send('Get all items');
};

const getItemById = (req: Request, res: Response): void => {
  const { id } = req.params;
  // Logic to get item by ID
  res.send(`Get item with ID: ${id}`);
};

const createItem = (req: Request, res: Response): void => {
  const newItem = req.body;
  // Logic to create a new item
  res.status(201).send('Item created');
};

const updateItem = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedItem = req.body;
  // Logic to update an item
  res.send(`Item with ID: ${id} updated`);
};

const deleteItem = (req: Request, res: Response): void => {
  const { id } = req.params;
  // Logic to delete an item
  res.send(`Item with ID: ${id} deleted`);
};

export {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};