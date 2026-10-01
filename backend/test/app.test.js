import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import {authenticate} from "../src/middleware/auth.js";
import { createTodoSchema, updateTodoSchema } from "../src/validators/todo.js";

const token = jwt.sign(
    {userId:"507f1f77bcf86cd799439011"},
    process.env.JWT_SECRET,
    {expiresIn:"1h"}
);

test("GET / returns the health response", async()=>{
    const response = await request(app).get("/");

    assert.equal(response.status,200);
    assert.equal(response.text,"Hello World");
});

test("unknown routes use the error handler", async()=>{
    const response = await request(app).get("/does-not-exist");

    assert.equal(response.status,404);
    assert.equal(response.body.success,false);
    assert.equal(response.body.error,"Route not found");
});

test("protected todo routes reject missing authentication", async()=>{
    const response = await request(app).get("/api/todos");

    assert.equal(response.status,401);
    assert.equal(response.body.success,false);
    assert.equal(response.body.message,"Authentication required");
});

test("protected todo routes reject invalid authentication", async()=>{
    const response = await request(app)
        .get("/api/todos")
        .set("Authorization","Bearer invalid-token");

    assert.equal(response.status,401);
    assert.equal(response.body.success,false);
    assert.equal(response.body.message,"Authentication required");
});

test("authentication middleware accepts a valid token", async()=>{
    const req = {
        headers:{authorization:`Bearer ${token}`}
    };
    let nextCalled = false;
    const res = {
        status(){
            return this;
        },
        json(){
            throw new Error("A valid token should not produce an error response");
        }
    };

    authenticate(req,res,()=>{
        nextCalled = true;
    });

    assert.equal(nextCalled,true);
    assert.equal(req.user.userId,"507f1f77bcf86cd799439011");
});

test("todo validation allows description-only data without a title", () => {
    const createResult = createTodoSchema.safeParse({ description: "Buy groceries" });
    const updateResult = updateTodoSchema.safeParse({
        todoId: "507f1f77bcf86cd799439011",
        description: "Buy groceries tomorrow"
    });

    assert.equal(createResult.success, true);
    assert.equal(updateResult.success, true);
});