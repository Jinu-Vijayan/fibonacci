import React, { useEffect, useRef, useState } from 'react';
import './home.css';

const Home = () => {

    const [todos , setTodos] = useState([]);
    const [skip, setSkip] = useState(0);
    const todoRef = useRef()

    useEffect(()=>{
        const todosData = localStorage.getItem("todos");
        if( todosData && JSON.parse(todosData).length > 0){
            setTodos(JSON.parse(todosData))
        }
    },[])

    useEffect(()=>{
        localStorage.setItem("todos", JSON.stringify(todos));
    },[todos])

    useEffect(()=>{
        fetch(`https://dummyjson.com/todos?limit=20&skip=${skip}`).then(res => res.json()).then((data) => {
            setTodos([...todos,...data.todos]);
        });
    },[skip])

    function clickHandler(){
        setSkip(skip + 20);
    }

    function changeHandler(id){
        setTodos((prev)=>{
            const oldData = [...prev];
            oldData[id - 1].completed = true;
            return oldData;
        })
    }

    function createTodo(){
        const todo = todoRef.current.value;
        const newTodo = {
            "id": todos.length + 1,
            "todo": todo,
            "completed": false,
            "userId": 26
        }

        setTodos([...todos,newTodo]);

        todoRef.current.value = "";
    }

    function deleteTodo(id){
        const todoData = [...todos];
        const filteredTodo = todoData.filter((data,index)=>{
            if(data.id !== id ){
                return true;
            } 
            return false;
        })

        setTodos(filteredTodo);

    }

  return (
    <div>
        <div>
            <input placeholder='Enter todo' ref={todoRef} />
            <button onClick={createTodo}>Add todo</button>
        </div>
        <div>
            <p>No.of todos on screen : {todos.length}</p>
            {
                todos && (
                    todos.map((data) =>{
                        return(
                            <div key={data.id} style={{
                                display : "flex",
                                gap : "1rem",
                                justifyContent : "center",
                                alignItems : "center"
                            }}>
                                <p>{data.todo}</p>
                                <div> 
                                    <input onChange={()=>{
                                        changeHandler(data.id - 1);
                                    }} type='checkbox' checked = {data.completed} />
                                    <label>Completed</label>
                                </div>
                                <button onClick={()=>{
                                    deleteTodo(data.id);
                                }} >Delete todo</button>
                            </div>
                        )
                    })
                )
            }
            {
                todos.length < 100 && <button onClick={clickHandler}>Load more</button>
            }
        </div>
        
    </div>
  )
}

export default Home