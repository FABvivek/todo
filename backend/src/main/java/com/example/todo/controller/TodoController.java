package com.example.todo.controller;

import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "todo-backend");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/todos")
    public ResponseEntity<List<TodoResponse>> getTodos(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(todoService.getTodos(completed, search));
    }

    @GetMapping("/todos/{id}")
    public ResponseEntity<TodoResponse> getTodoById(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.getTodoById(id));
    }

    @PostMapping("/todos")
    public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody TodoRequest request) {
        TodoResponse created = todoService.createTodo(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/todos/{id}")
    public ResponseEntity<TodoResponse> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoRequest request) {
        return ResponseEntity.ok(todoService.updateTodo(id, request));
    }

    @PatchMapping("/todos/{id}/toggle")
    public ResponseEntity<TodoResponse> toggleTodo(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.toggleTodoStatus(id));
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<Map<String, String>> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Todo deleted successfully");
        response.put("id", id.toString());
        return ResponseEntity.ok(response);
    }
}
