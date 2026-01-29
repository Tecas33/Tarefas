import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, ClipboardList } from 'lucide-react';
import type { Todo } from '../types/Todo'; // Importe sua interface

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  // 1. Criar Tarefa
  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      isEditing: false
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  // 2. Eliminar
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 3. Alternar Concluído
  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 4. Iniciar/Salvar Edição
  const toggleEdit = (id: string, newText?: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { 
          ...todo, 
          isEditing: !todo.isEditing, 
          text: newText ?? todo.text 
        };
      }
      return todo;
    }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
      <header className="flex items-center gap-2 mb-6">
        <ClipboardList className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold text-slate-800">Tarefas do Dia</h1>
      </header>

      {/* Input de Criação */}
      <div className="flex gap-2 mb-8">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="O que precisa ser feito?"
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button 
          onClick={addTodo}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Lista de Tarefas */}
      <ul className="space-y-3">
        {todos.map(todo => (
          <li key={todo.id} className="group flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
            <div className="flex items-center gap-3 flex-1">
              <input 
                type="checkbox" 
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              
              {todo.isEditing ? (
                <input 
                  autoFocus
                  defaultValue={todo.text}
                  onBlur={(e) => toggleEdit(todo.id, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleEdit(todo.id, e.currentTarget.value)}
                  className="flex-1 bg-white border-b-2 border-blue-500 outline-none px-1"
                />
              ) : (
                <span className={`flex-1 text-slate-700 ${todo.completed ? 'line-through text-slate-400' : ''}`}>
                  {todo.text}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => toggleEdit(todo.id)}
                className="p-1 text-slate-400 hover:text-blue-600"
              >
                {todo.isEditing ? <Check size={18} /> : <Edit2 size={18} />}
              </button>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="p-1 text-slate-400 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-center text-slate-400 mt-4 text-sm">Nenhuma tarefa por aqui...</p>
      )}
    </div>
  );
}