import React, { useState } from 'react'

const Tab = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);


    const handleTabClick = (index) => {
        setActiveTab(index);
    };
    return(
        <div className="flex flex-col">
            <div className='flex justify-evenly'>
                {tabs.map((tab, index) => (
                    <button key={index}
                    className={`px-4 py-2 w-full border-x ${activeTab === index? 'bg-gray border-t-4 border-white':'bg-lime border-0 border-none'}`} onClick={() => handleTabClick(index)}>{tab.label}</button>
                ))}
            </div>
            <div className='text-center text-gray mt-8 flex flex-col py-12 text-3xl font-bold sm:text-base sm:font-normal sm:text-center sm:mt-0'>
                {tabs[activeTab].content}
                <p className='text-red'>
                    {tabs[activeTab].note}
                </p>
            </div>
        </div>
    )
}

export default Tab;
