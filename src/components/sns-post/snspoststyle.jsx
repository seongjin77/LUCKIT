import styled from 'styled-components';

const SnsPostModalWrap= styled.div`
  align-items: left;
    box-sizing: border-box;
    width: 95%;
    height: 95%;
    position: absolute;
    top:50%;
    left: 50%;
    padding-top: 11px;
    transform: translate(-50%, -50%);
    background: #E2F2CE;
    display: flex;
    flex-direction: column;
    z-index: 90;
    border: 1px solid black;
    border-radius: 8px;
    > button{
    position: absolute;
    right: 10px;
    top: 10px;
    }
`;

export { SnsPostModalWrap }


const CommentInp= styled.input`
  align-items: left;
    box-sizing: border-box;
    width: 100%;
    height: 10%;
    padding-top: 11px;
    background: #E2F2CE;
    z-index: 10;
    border: none;
    border-top: 1px solid #DBDBDB;
`;

export { CommentInp }