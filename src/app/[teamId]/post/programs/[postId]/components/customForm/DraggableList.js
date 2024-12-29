'use client'

import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import {arrayMoveImmutable} from "array-move"

// Component for individual draggable item
const DraggableItem = ({ item, index, moveItem }) => {
  const [, ref] = useDrag({
    type: 'ITEM',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} 
      style={{}}
    >
      {item}
    </div>
  );
};

// Draggable list component
const DraggableList = ({
  items, setItems,
  components, setComponents,
}) => {
  const moveItem = (fromIndex, toIndex) => {
    // const updatedItems = [...items];
    // const [removedItem] = updatedItems.splice(fromIndex, 1);
    // updatedItems.splice(toIndex, 0, removedItem);
    // setItems(updatedItems);
    setItems(arrayMoveImmutable(items, fromIndex, toIndex))
    setComponents(arrayMoveImmutable(components, fromIndex, toIndex))
  };

  return (
    <DndProvider backend={HTML5Backend} options={{enableMouseEvents: true}}>
    <div className='w-full'>
      {components.map((component, index) => (
        <DraggableItem key={index} index={index} 
          item={component} moveItem={moveItem} 
        />
      ))}
    </div>
    </DndProvider>
  );
};

export default DraggableList;
