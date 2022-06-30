import React, { useContext, useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import CloseSVG from '../components/svg/CloseSVG';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../context';
import axios from 'axios'
import KanbanCard from '../components/Kanban/KanbanCard';
const KanBan = () => {

    const [flag,setFlag] = useState(true)
    const {username, setUsername} = useContext(AuthContext)
    const [columns,setColumns] = useState({})
    const socket = useRef()
    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;
      
        if (source.droppableId !== destination.droppableId) {
          const sourceColumn = columns[source.droppableId];
          const destColumn = columns[destination.droppableId];
          const sourceItems = [...sourceColumn.items];
          const destItems = [...destColumn.items];
          const [removed] = sourceItems.splice(source.index, 1);
          destItems.splice(destination.index, 0, removed);
          
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems
            }
          });
        } else {
          const column = columns[source.droppableId];
          const copiedItems = [...column.items];
          const [removed] = copiedItems.splice(source.index, 1);
          copiedItems.splice(destination.index, 0, removed);
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...column,
              items: copiedItems
            }
          });
        }
      };
    
    const webSocketStart = () => {
        socket.current = new WebSocket(`ws://localhost:5000/`)
        socket.current.onopen = () => {
            console.log('Подключение установлено')
            socket.current.send(JSON.stringify({
                id: 1337,
                username: username,
                method: 'connection'
            }))
        }
        socket.current.onmessage = (event) => {
            let msg = JSON.parse(event.data)
            switch (msg.method) {
                case "connection":
                    console.log(`user ${msg.username} connected!`)
                    break
                case "kanban":
                    onUpdateKanbanHandler(msg)
                    break
            }
        }
    }
    const onPageLoaded = async () => {
        await axios({
            method: 'get',
            url: 'http://localhost:5000/getKanban',
        })
            .then(response => {
                if(response.data.status){
                    setColumns(response.data.kanbanData)
                }
                else{
                    console.log('kanbanData is empty')
                }
            })
    }
    
    const onColumnNameChangeHandler = (e, columnId) => {
        setColumns({
            ...columns,
            [columnId]:{
                name: e.currentTarget.value,
                items: columns[columnId].items
            }
        })
    }

    const onColumnDeleteClickHander = (columnId) => {
        const newColumns = columns
        delete newColumns[columnId]
        setColumns({...newColumns})
    }

    const onColumnAddClickHander = () => {
        setColumns({
            ...columns,
            [uuidv4()]:{
                name:"new column",
                items:[]
            }
        })
    }

    const onCardAddClickHander = (columnId) => {
        setColumns({
            ...columns,
            [columnId]:{
                name:columns[columnId].name,
                items:[...columns[columnId].items, {id: uuidv4(), content:"New Card"}]
            }
        })
    }
    
    useEffect( () => {
        onPageLoaded()
        webSocketStart()
    },[])

    useEffect( () => {
        if(flag){
            if(socket.current.readyState == 1){
                const message = {
                    id: 1337,
                    username: username,
                    method: "kanban",
                    kanbanData: columns
                }
                socket.current.send(JSON.stringify(message))
            }
        }
        setFlag(true)
    },[columns])
    
    const onUpdateKanbanHandler = (msg) => {
        setFlag(false)
        setColumns(msg.kanbanData)
    }

    return (
        <div className='kanban'>
            <div className='kanban_content'>
                <div className='kanban_title'>
                    <input type='text' placeholder="KanBan Title..." />
                </div>
                <div className='kanban_table'>
                    { columns ? 
                        <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                            {Object.entries(columns).map(([columnId, column], index) => {
                            return (
                                <div
                                style={{
                                    height: '100%',
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                                key={columnId}
                                >
                                    {/* одна колонка */}
                                <div style={{ margin: 8, height: '100%'}} className="kanban_column"> 
                                    <p style={{userSelect: "none"}} className='kanban_column_name'><input type='text' value={column.name}
                                        onChange={(e) => onColumnNameChangeHandler(e, columnId)}
                                    />
                                    <CloseSVG fill='#777' onClick={() => onColumnDeleteClickHander(columnId)}/>
                                    </p>
                                    <Droppable droppableId={columnId} key={columnId}>
                                    {(provided, snapshot) => {
                                        return (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className='kanban_column_content'
                                            style={{
                                                background: snapshot.isDraggingOver
                                                ? "#add8e6a9"
                                                : "#d3d3d380"
                                            }}
                                        >
                                            {column.items.map((item, index) => {
                                            return (
                                                <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                                >
                                                {(provided, snapshot) => {
                                                    return (
                                                        //! одна карточка
                                                        <KanbanCard
                                                        provided={provided}
                                                        snapshot={snapshot}
                                                        columns={columns}
                                                        setColumns={setColumns}
                                                        column={column}
                                                        columnId={columnId}
                                                        item={item}
                                                        index={index}/>
                                                    );
                                                }}
                                                </Draggable>
                                            );
                                            })}
                                            <div className='kanban_addItem' onClick={() => onCardAddClickHander(columnId)}>
                                                <CloseSVG fill='#56b5b8'/>
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                        );
                                    }}
                                    </Droppable>
                                </div>
                                </div>
                            );
                            })}
                            <div className='kanban_addtable'>
                                <div className='kanban_addtable_item' onClick={() => onColumnAddClickHander()}>
                                    <CloseSVG fill='#777'/>
                                </div>
                            </div>
                    </DragDropContext>
                    : <></>
                    }       
                </div>
            </div>
        </div>
    );
};

export default KanBan;