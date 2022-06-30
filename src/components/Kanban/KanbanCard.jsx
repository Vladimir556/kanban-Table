import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import CloseSVG from '../svg/CloseSVG';

const KanbanCard = ({
    provided,
    snapshot,
    columns,
    setColumns,
    column,
    columnId,
    item,
    index
    }) => {
    
    const [isAddBtnActive, setIsAddBtnActive] = useState(false)
    const [cardName, setCardName] = useState(item.content)
    const [cardText, setCardText] = useState(item.text)


    const onUpdateCardHandler = () => {
        if(cardName !== item.content || cardText!== item.text)
        {
            const newItems = columns[columnId].items.map(el => {
                if(el.id == item.id)
                    return {id:el.id, content:cardName,text:cardText}
                else
                    return el
            })
            setColumns({
                ...columns,
                [columnId]:{
                    name: column.name,
                    items: newItems ? newItems : []
                }
            })
        }
    }
    
    // обновление картчки при новых данных с сервера
    useEffect( () => {
        setCardName(item.content)
        setCardText(item.text)
    },[item])

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className='kanban_card'
            style={{
            ...provided.draggableProps.style
            }}
        >
            <div className='kanban_card_delete'>
                <CloseSVG onClick={() => {
                    const newItems = columns[columnId].items.filter((elem) => elem.id !== item.id)
                    setColumns({
                        ...columns,
                        [columnId]:{
                            name:column.name,
                            items:newItems
                        }
                    })
                }}/>
            </div>
            {/* card title */}
            <input type="text" value={cardName}
            onChange={(e) => setCardName(e.currentTarget.value)}
            onBlur={() => onUpdateCardHandler()}
            />
            <textarea type="textarea" className='kanban_card_text' value={cardText}
            onChange={(e) => setCardText(e.currentTarget.value)}
            onBlur={() => onUpdateCardHandler()}
            />
            <p className='kanban_card_created'>21.01.22 15:30</p>
        </div>
    );
};

export default KanbanCard;