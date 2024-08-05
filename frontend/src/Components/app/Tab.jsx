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
                    className={`px-4 py-2 w-full border-x-2 ${activeTab === index? 'bg-gray border-t-4 border-white':'bg-lime border-0 border-none'}`} onClick={() => handleTabClick(index)}>{tab.label}</button>
                ))}
            </div>
            <div className='p-4 text-center text-gray mt-8'>
                {tabs[activeTab].content}
            </div>
        </div>
    )
}

export default Tab;
