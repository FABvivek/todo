package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.exception.ResourceNotFoundException;
import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Transactional(readOnly = true)
    public List<TodoResponse> getTodos(Boolean completed, String search) {
        List<Todo> todos;
        if (search != null && !search.trim().isEmpty()) {
            todos = todoRepository.searchTodos(completed, search.trim());
        } else if (completed != null) {
            todos = todoRepository.findByCompletedOrderByCreatedAtDesc(completed);
        } else {
            todos = todoRepository.findAllByOrderByCreatedAtDesc();
        }
        return todos.stream()
                .map(TodoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TodoResponse getTodoById(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
        return TodoResponse.fromEntity(todo);
    }

    @Transactional
    public TodoResponse createTodo(TodoRequest request) {
        Todo todo = new Todo();
        todo.setTitle(request.getTitle().trim());
        todo.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        todo.setCompleted(request.getCompleted() != null ? request.getCompleted() : false);
        Todo saved = todoRepository.save(todo);
        return TodoResponse.fromEntity(saved);
    }

    @Transactional
    public TodoResponse updateTodo(Long id, TodoRequest request) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        todo.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) {
            todo.setDescription(request.getDescription().trim());
        }
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }

        Todo updated = todoRepository.save(todo);
        return TodoResponse.fromEntity(updated);
    }

    @Transactional
    public TodoResponse toggleTodoStatus(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        todo.setCompleted(!todo.isCompleted());
        Todo updated = todoRepository.save(todo);
        return TodoResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Todo not found with id: " + id);
        }
        todoRepository.deleteById(id);
    }
}
