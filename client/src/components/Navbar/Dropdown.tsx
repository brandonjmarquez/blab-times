import React from 'react';

interface Props {
  submenus: any;
  dropdown: boolean;
}

const Dropdown = (props: Props) => {
  return (
    <ul className={`absolute right-0 left-auto z-50 w-full ${props.dropdown ? "block" : "hidden"}`}>
      {props.submenus.map((submenu: any, index: number) => {
        if(index === 0) {
          return (
            <li key={index} className="relative w-full bg-custom-300 hover:bg-green-300 rounded-t-md p-1">
              <a href={submenu.url} className="block">{submenu.title}</a>
            </li>
          )
        } else if(index === props.submenus.length - 1) {
          return (
            <li key={index} className="relative w-full bg-custom-300 hover:bg-green-300 rounded-b-md p-1">
              <a href={submenu.url} className="block">{submenu.title}</a>
            </li>
          )
        } else {
          return (
            <li key={index} className="relative w-full bg-custom-300 hover:bg-green-300 p-1">
              <a href={submenu.url} className="block">{submenu.title}</a>
            </li>
          )
        }
      })}
    </ul>
  );
};

export default Dropdown;