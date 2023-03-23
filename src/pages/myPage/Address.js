import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { address, insertAddress, deleteAddress, insDefaultAddr } from 'utils/axios';

import Loading from 'components/loding/Loading';
import DaumPost from 'components/daumPost/DaumPost';
import SubTitle from 'components/myPage/SubTitle';

import * as Common from "assets/styleComponent/myPage/myPage"
import * as Style from "assets/styleComponent/myPage/address"

const Address = ({ }) => {
    const id = sessionStorage.getItem("userId");
    const [list, setBoard] = useState("");
    const [shipName, setShipName] = useState("");
    const [shipAddress, setShipAddress] = useState("");
    const [shipPhone, setShipPhone] = useState("");
    const [shipReceiver, setShipReceiver] = useState("");
    const [showShipping, setShowShipping] = useState(false);
    const [insetAddress, setinsetAddress] = useState("");
    const [zoneCode, setZoneCode] = useState("");
    const [isPostOpen, setIsPostOpen] = useState(false);

    const destination = useMutation(address); // 배송지 불러오기
    const userShipAdd = useMutation(insertAddress); // 신규 배송지 추가
    const userShipDel = useMutation(deleteAddress); // 배송지 삭제
    const DefaultAddr = useMutation(insDefaultAddr); // 기본 배송지로 설정

    //새 배송지 추가시 보여줄 div
    const showShipDiv = () => {
        showShipping === false ? setShowShipping(true) : setShowShipping(false);
    }

    //유저 배송지 받기
    const getAddrData = async () => {
        const data = {
            userId: sessionStorage.getItem('userId'),
            token: sessionStorage.getItem("token")
        };
        await destination.mutateAsync(data);
        setBoard(data.result);
    }

    //배송지 추가
    const setShipping = async () => {
        const data = {
            user_id: id,
            ship_address: insetAddress,
            ship_detail_address: shipAddress,
            ship_name: shipName,
            ship_phone: shipPhone,
            ship_receiver: shipReceiver
        };
        await userShipAdd.mutateAsync(data);
        setShowShipping(false);
    }

    //배송지 삭제
    const delShpping = async (addrValue) => {
        if (window.confirm("정말로 삭제 하시겠습니까?")) {
            const data = {
                i_addr: addrValue
            }
            await userShipDel.mutateAsync(data);
        }
    }

    //기본 배송지 설정
    const setDefaultAddr = async (addrValue) => {
        const data = {
            user_id: id,
            i_addr: addrValue
        }
        await DefaultAddr.mutateAsync(data);
    }

    useEffect(() => {
        getAddrData();
    }, [])

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        switch (name) {
            case "shipName":
                setShipName(value);
                break;
            case "shipAddress":
                setShipAddress(value);
                break;
            case "shipPhone":
                setShipPhone(value);
                break;
            case "shipReceiver":
                setShipReceiver(value);
                break;
            default:
                break;
        }
    }

    return (
        <Common.InDiv>
            <SubTitle h2={"배송지 관리"} h3={"배송지에 따라 상품유형 및 배송정보가 달라질 수 있습니다."} clickEvent={showShipDiv} clickText={"+ 새 배송지 추가"} />
            {
                showShipping &&
                <Style.Shipping>
                    <form>
                        <div>
                            <span>배송지명</span>
                            <input type="text" name='shipName' onChange={onChange} /></div>
                        <div>
                            <span>
                                <span>주소</span>
                                <span
                                    onClick={() => {
                                        setIsPostOpen(true);
                                    }}
                                    className='pointer clickBox'>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </span>
                            </span>
                            <input
                                type="text"
                                readOnly
                                value={insetAddress === ""
                                    ? ""
                                    : insetAddress}
                                name='AddAddress' />
                        </div>
                        <div>
                            <span></span>
                            <input
                                type="text"
                                name='shipAddress'
                                placeholder='상세주소'
                                onChange={onChange} />
                        </div>
                        {
                            isPostOpen &&
                            <DaumPost
                                setIsPostOpen={setIsPostOpen}
                                setZoneCode={setZoneCode}
                                setAddress={setinsetAddress}
                            ></DaumPost>
                        }
                        <div>
                            <span>받으실 분</span>
                            <input
                                type="text"
                                name='shipReceiver'
                                onChange={onChange} />
                        </div>
                        <div>
                            <span>연락처</span>
                            <input
                                type="text"
                                name='shipPhone'
                                onChange={onChange} />
                        </div>
                        <div className='btn'>
                            <input
                                className='pointer'
                                type="button"
                                value="추가"
                                onClick={() => {
                                    setShipping();
                                }} />
                        </div>
                    </form>
                </Style.Shipping>
            }

            {
                destination.isSuccess &&
                <Style.Contents>
                    <Style.Column>
                        <li className='flex60'>선택</li>
                        <li className='flex60'>배송지명</li>
                        <ul className='flex580'>
                            <li className='flex360'>주소</li>
                            <li className='flex120'>받으실 분</li>
                            <li className='flex100'>연락처</li>
                        </ul>
                        {/* <div className='flex60'>수정</div> */}
                        <li className='flex60'>삭제</li>
                    </Style.Column>

                    {
                        list.map((item, i) => {
                            return (

                                <Style.Ctnt key={i}>
                                    <li className='flex60'>
                                        <i className={(item.default_address === 1)
                                            ? "fa-regular fa-circle-check pointer"
                                            : "fa-regular fa-circle pointer"}
                                            onClick={() => {
                                                setDefaultAddr(item.i_addr);
                                            }}></i>
                                    </li>
                                    <li className='flex60'>{item.ship_name}</li>
                                    <ul className='flex580'>
                                        <li className='flex360'>
                                            <span>{item.ship_address}</span>
                                            <span>{item.ship_detail_address}</span>
                                        </li>
                                        <li className='flex120'>
                                            <span>
                                                {item.ship_receiver}
                                            </span>
                                            <span className='mobile'>
                                                {item.ship_phone}
                                            </span>
                                        </li>
                                        <li className='flex100 pc'>{item.ship_phone}</li>
                                        {/* <div className='flex60'><i className="fa-solid fa-pen"></i></div> */}
                                    </ul>
                                    <li className='flex60 pointer' onClick={() => {
                                        delShpping(item.i_addr);
                                    }}><i className="fa-sharp fa-solid fa-trash"></i></li>
                                </Style.Ctnt >
                            )
                        })
                    }
                </Style.Contents >
            }

            {destination.isLoading && <Loading />}
        </Common.InDiv >

    );
};
export default Address;