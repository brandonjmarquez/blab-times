import React, { useEffect, useState } from 'react';
import MenuItem from './MenuItem';
import Navbar from './Navbar';

interface Props {
  depthLevel: number;
  dropdown: boolean;
  submenus: any;
}

const Dropdown = (props: Props) => {
  const depthLevel = props.depthLevel + 1
  const dropdownClass = depthLevel > 1 ? "absolute right-full top-[-100%]" : "";
  const dropped = props.dropdown ? "block" : "hidden"

  return (
    <ul className={`absolute right-0 left-auto z-50 w-fit whitespace-nowrap ${dropdownClass} ${dropped}`}>
      {props.submenus.map((submenu: any, index: number) => {
        if(index === 0) {
          return (
            <MenuItem key={index} index={index} buttonClassName="bg-custom-300" liClassName="relative w-full" depthLevel={depthLevel} items={submenu}/>
          );
        } else if(index === props.submenus.length - 1) {
          return (
            <MenuItem key={index} index={index} buttonClassName="bg-custom-300" liClassName="relative w-full" depthLevel={depthLevel} items={submenu}/>
          );
        } else {
          return (
            <MenuItem key={index} index={index} buttonClassName="bg-custom-300" liClassName="relative w-full" depthLevel={depthLevel} items={submenu}/>
          );
        }
      })}
    </ul>
  );
};

export default Dropdown;