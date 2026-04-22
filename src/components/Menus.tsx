import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

// 1. Interfaces for State and Styled Props
interface Position {
  x: number;
  y: number;
}

interface StyledListProps {
  $position: Position;
}

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul<StyledListProps>`
  position: fixed;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  /* Using the passed position object */
  right: ${(props) => props.$position.x}px;
  top: ${(props) => props.$position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

// 2. Context Typing
interface MenusContextValue {
  openId: number | null;
  close: () => void;
  open: (id: number) => void;
  position: Position | null;
  setPosition: (pos: Position) => void;
}

const MenusContext = createContext<MenusContextValue | undefined>(undefined);

// 3. Component Implementation
function Menus({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [position, setPosition] = useState<Position | null>(null);

  const close = () => setOpenId(null);
  const open = (id: number) => setOpenId(id);

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }: { id: number }) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("Menus.Toggle must be used within Menus");

  const { openId, close, open, setPosition } = context;

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    // Get position of the trigger button
    const rect = (e.target as HTMLElement)
      .closest("button")
      ?.getBoundingClientRect();

    if (rect) {
      setPosition({
        x: window.innerWidth - rect.width - rect.x,
        y: rect.y + rect.height + 8,
      });
    }

    if (openId === null || openId !== id) open(id);
    else close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

interface ListProps {
  children: ReactNode;
  id: number;
}

function List({ children, id }: ListProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("Menus.List must be used within Menus");

  const { openId, close, position } = context;

  // Custom hook we typed earlier! T extends HTMLElement
  const ref = useOutsideClick<HTMLUListElement>(close, false);

  if (openId !== id || !position) return null;

  return createPortal(
    <StyledList $position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body,
  );
}

interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
}

function Button({ children, icon, onClick }: ButtonProps) {
  const context = useContext(MenusContext);
  if (!context) throw new Error("Menus.Button must be used within Menus");

  function handleClick() {
    onClick?.();
    if (context) context.close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
