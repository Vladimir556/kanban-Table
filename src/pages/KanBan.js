import React, { useContext, useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import CloseSVG from '../components/svg/CloseSVG';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext, NotyfContext } from '../context';
import axios from 'axios'
import Card from '../components/Kanban/Card';

const KanBan = () => {

    const [isDragAllow, setIsDragAllow] = useState(false)
    const [flag,setFlag] = useState(true)
    const {username, setUsername} = useContext(AuthContext)
    const notyf = useContext(NotyfContext)
    const [columns,setColumns] = useState({})
    const socket = useRef()
    
    const NotyfInfo = (msg, color = "#027dc5") => {
        notyf.success({
            message:msg,
            icon: false,
            background:"#027dc5",
            dismissible:true
        })
    }

    const onDragStart = (result) => {
        if(result.source.droppableId == "board"){
            setIsDragAllow(false)
        }
        else{
            setIsDragAllow(true)
        } 
    }

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if(source.droppableId !== "board"){
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
        } else {
            if(source.index !== destination.index){
                let destID
                Object.entries(columns).forEach(([key,value], ind) => {
                    if(ind == destination.index)
                    destID = key
                })
                setColumns({
                    ...columns,
                    [result.draggableId]:{
                        ...columns[destID]
                    },
                    [destID]:{
                        ...columns[result.draggableId]
                    }
                })
            }
        }
      };
    
    const webSocketStart = () => {
        socket.current = new WebSocket(`ws://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/`)
        socket.current.onopen = () => {
            console.log('Подключение установлено')
            notyf.success('Подключение установлено')
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
                    NotyfInfo(`${msg.username} connected!`)
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
            url: `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/getKanban`,
        })
            .then(response => {
                if(response.data.status){
                    setColumns(response.data.kanbanData)
                }
                else{
                    console.log('kanbanData is empty')
                    notyf.error('kanbanData is empty')
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
        NotyfInfo(`column ${newColumns[columnId].name} has been removed`)
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
                        <DragDropContext onBeforeDragStart={(result) => onDragStart(result)} onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                            <Droppable droppableId='board' direction='horizontal' isDropDisabled={isDragAllow}>
                                {(providedBoadrd) => (
                                    <div style={{
                                        display: "flex"
                                        }}
                                        ref={providedBoadrd.innerRef}
                                        {...providedBoadrd.droppableProps}
                                    >
                                    {Object.entries(columns).map(([columnId, column], index) => {
                                    return (
                                        <Draggable draggableId={columnId} index={index} key={columnId}>
                                            {(providedCol,snapshotCol) => {
                                                return (
                                                    <div
                                                    style={{
                                                        ...providedCol.draggableProps.style
                                                        }}
                                                    ref={providedCol.innerRef}
                                                    {...providedCol.draggableProps}
                                                    {...providedCol.dragHandleProps}
                                                    
                                                    //key={columnId}
                                                    className="kanban_column"
                                                    >
                                                        <div style={{ margin: 8, height: '100%'}} className="kanban_column"> 
                                                            <p style={{userSelect: "none"}} className="kanban_column_name">
                                                                {column.name}
                                                                <CloseSVG fill='#777' onClick={() => onColumnDeleteClickHander(columnId)}/>
                                                            </p>
                                                            <Droppable droppableId={columnId} isDropDisabled={!isDragAllow}>
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
                                                                        <Card 
                                                                        columns={columns}
                                                                        setColumns={setColumns}
                                                                        column={column}
                                                                        columnId={columnId}
                                                                        item={item}
                                                                        index={index}
                                                                        />
                                                                    );
                                                                    })}
                                                                    <div className='kanban_addItem' onClick={() => onCardAddClickHander(columnId)}>
                                                                        <CloseSVG fill='#027dc5'/>
                                                                    </div>
                                                                    {provided.placeholder}
                                                                </div>
                                                                );
                                                            }}
                                                            </Droppable>
                                                        </div>
                                                    </div>
                                                )
                                            }}
                                        </Draggable>
                                    );
                                    })}
                                    </div>
                            )}
                            </Droppable>
                            <div className='kanban_addtable'>
                                <div className='kanban_addtable_item' onClick={() => onColumnAddClickHander()}>
                                    <CloseSVG fill='#027dc5'/>
                                </div>
                            </div>
                        </DragDropContext>
                    //     <DragDropContext onBeforeDragStart={(result) => onDragStart(result)} onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                    //         {Object.entries(columns).map(([columnId, column], index) => {
                    //         return (
                    //             <div
                    //             style={{
                    //                 height: '100%',
                    //                 display: "flex",
                    //                 flexDirection: "column",
                    //                 alignItems: "center",
                    //             }}
                    //             key={columnId}
                    //             >
                    //                 {/* одна колонка */}
                    //             <div style={{ margin: 8, height: '100%'}} className="kanban_column"> 
                    //                 <p style={{userSelect: "none"}} className='kanban_column_name'><input type='text' value={column.name}
                    //                     onChange={(e) => onColumnNameChangeHandler(e, columnId)}
                    //                 />
                    //                 <CloseSVG fill='#777' onClick={() => onColumnDeleteClickHander(columnId)}/>
                    //                 </p>
                    //                 <Droppable droppableId={columnId} key={columnId}>
                    //                 {(provided, snapshot) => {
                    //                     return (
                    //                     <div
                    //                         {...provided.droppableProps}
                    //                         ref={provided.innerRef}
                    //                         className='kanban_column_content'
                    //                         style={{
                    //                             background: snapshot.isDraggingOver
                    //                             ? "#add8e6a9"
                    //                             : "#d3d3d380"
                    //                         }}
                    //                     >
                    //                         {column.items.map((item, index) => {
                    //                         return (
                    //                             <Card
                    //                                 provided={provided}
                    //                                 snapshot={snapshot}
                    //                                 columns={columns}
                    //                                 setColumns={setColumns}
                    //                                 column={column}
                    //                                 columnId={columnId}
                    //                                 item={item}
                    //                                 index={index}/>
                    //                         );
                    //                         })}
                    //                         <div className='kanban_addItem' onClick={() => onCardAddClickHander(columnId)}>
                    //                             <CloseSVG fill='#027dc5'/>
                    //                         </div>
                    //                         {provided.placeholder}
                    //                     </div>
                    //                     );
                    //                 }}
                    //                 </Droppable>
                    //             </div>
                    //             </div>
                    //         );
                    //         })}
                    //         <div className='kanban_addtable'>
                    //             <div className='kanban_addtable_item' onClick={() => onColumnAddClickHander()}>
                    //                 <CloseSVG fill='#027dc5'/>
                    //             </div>
                    //         </div>
                    // </DragDropContext>
                    : <></>
                    }       
                </div>
            </div>
        </div>
    );
};

export default KanBan;