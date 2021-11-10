import '../../styles/Lobby.css';
import RoomList from '../Lobby/RoomList';
import Profile from '../Lobby/Profile';
import LobbyButtons from '../Lobby/LobbyButtons';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import setModal from '../../utils/setModal';

interface roomInterface {
  [prop: string]: string;
}

const filterRooms = (rooms: Array<roomInterface>, filterWord: string) => {
  if (filterWord === '') return rooms;
  return rooms.filter((room: roomInterface) => room[0].includes(filterWord));
};

const Lobby = () => {
  const { socket }: { socket: Socket } = useContext(globalContext);
  const [rooms, setRooms] = useState([]);
  const [filterWord, setFilterWord] = useState('');
  const history = useHistory();
  const setModalState = useSetRecoilState(globalAtom.modal);

  const popModal = (type: 'alert' | 'warning' | 'error', ment: string) => {
    setModal(setModalState, { type, ment });
  };

  useEffect(() => {
    socket.on('room create', (data) => {
      if (data) {
        history.push('/game');
      } else {
        popModal('error', '중복된 방제가 있습니다.');
      }
    });

    socket.on('room list', (roomList) => {
      setRooms(roomList);
    });

    socket.emit('room list', null);
  }, []);

  return (
    <div id="lobby">
      <div className="lobby-center-items">
        <div className="lobby-header">Liar Game</div>
        <div className="lobby-rooms">
          <RoomList rooms={filterRooms(rooms, filterWord)} filterWord={filterWord} setRooms={setRooms} />
        </div>
      </div>
      <div className="lobby-right-items">
        <Profile />
        <LobbyButtons setFilterWord={setFilterWord} />
      </div>
    </div>
  );
};

export default React.memo(Lobby);
