import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useRealtimeSubscription } from '../hooks/useSupabase'

interface Todo {
    id: number
    text: string
    completed: boolean
    user_id: string
    created_at: string
}

export function Dashboard() {
    const { user, signOut } = useAuth()
    const [todos, setTodos] = useState<Todo[]>([])
    const [newTodo, setNewTodo] = useState('')
    const [loading, setLoading] = useState(true)

    // Fetch todos
    const fetchTodos = useCallback(async () => {
        if (!user) return

        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setTodos(data)
        }
        setLoading(false)
    }, [user])

    useEffect(() => {
        fetchTodos()
    }, [fetchTodos])

    // Real-time subscription
    const handleRealtimeUpdate = useCallback((payload: any) => {
        if (payload.eventType === 'INSERT') {
            setTodos((prev) => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
            setTodos((prev) =>
                prev.map((todo) => (todo.id === payload.new.id ? payload.new : todo))
            )
        } else if (payload.eventType === 'DELETE') {
            setTodos((prev) => prev.filter((todo) => todo.id !== payload.old.id))
        }
    }, [])

    useRealtimeSubscription('todos', handleRealtimeUpdate)

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTodo.trim() || !user) return

        const { error } = await supabase.from('todos').insert([
            {
                text: newTodo,
                completed: false,
                user_id: user.id,
            },
        ])

        if (!error) {
            setNewTodo('')
        }
    }

    const toggleTodo = async (id: number, completed: boolean) => {
        await supabase.from('todos').update({ completed: !completed }).eq('id', id)
    }

    const deleteTodo = async (id: number) => {
        await supabase.from('todos').delete().eq('id', id)
    }

    const handleSignOut = async () => {
        await signOut()
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your todos...</p>
            </div>
        )
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <div className="user-info">
                    <span className="user-email">{user?.email}</span>
                    <button onClick={handleSignOut} className="btn btn-secondary">
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="todo-container">
                <div className="todo-header">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Real-time Todo List
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        Try opening this in multiple tabs to see real-time updates! ✨
                    </p>
                </div>

                <form onSubmit={addTodo} className="todo-input-group">
                    <input
                        type="text"
                        className="input-field todo-input"
                        placeholder="What needs to be done?"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Add Todo
                    </button>
                </form>

                <div className="todo-list">
                    {todos.length === 0 ? (
                        <div className="empty-state">
                            <p>No todos yet. Add one to get started!</p>
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <div key={todo.id} className="todo-item">
                                <input
                                    type="checkbox"
                                    className="todo-checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id, todo.completed)}
                                />
                                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                                    {todo.text}
                                </span>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="todo-delete"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
