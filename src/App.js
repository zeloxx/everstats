import React, { useState } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Tooltip from './Tooltip';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import { dynamicCellStyle } from './helpers/helpers';

const level = [];
for (let i = 1; i <= 100; i++) {
    level.push(i);
}

const App = () => {
    const [gridApi, setGridApi] = useState(null);
    // eslint-disable-next-line
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [showFilters, setShowFilters] = useState(true);
    const [findingItems, setFindingItems] = useState(false);

    const updateData = (data) => {
        setRowData(data);
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.closeToolPanel();
        // params.api.sizeColumnsToFit();
    };

    const addGridToWindow = () => {
        window.grid = gridApi;
        // gridApi && gridApi.sizeColumnsToFit();
    };

    const createQueryString = () => {
        let queryString = '?';

        const itemname = document.querySelector('#name')?.value;
        if (itemname) {
            queryString += `displayname=${itemname}&`;
        }

        const classtype = document.querySelector('#class').value;
        if (classtype) {
            queryString += `typeinfo.classes.${classtype}.id=>0&`;
        }

        const slot = document.querySelector('#slot').value;
        if (slot) {
            queryString += `slot_list.name=${slot}&`;
        }

        const minlevel = document.querySelector('#minlevel').value;
        if (minlevel) {
            queryString += `leveltouse=]${minlevel}&`;
        }

        const maxlevel = document.querySelector('#maxlevel').value;
        if (maxlevel) {
            queryString += `leveltouse=[${maxlevel}&`;
        }

        return queryString;
    };

    const getData = () => {
        setFindingItems(true);
        return fetch(
            `http://census.daybreakgames.com/s:eq2calculator/count/eq2/item/${createQueryString()}`
        )
            .then((resp) => resp.json())
            .then((data) => {
                const count = data.count;

                const starts = [];

                for (let i = 0; i < count; i += 100) {
                    starts.push(i);
                }

                Promise.all(
                    starts.map((startAt) => {
                        return fetch(
                            `http://census.daybreakgames.com/s:eq2calculator/get/eq2/item/${createQueryString()}c:limit=100&c:start=${startAt}`
                        )
                            .then((resp) => resp.json())
                            .then((data) => {
                                return data.item_list;
                            });
                    })
                )
                    .then((responses) => {
                        let allItems = [];
                        responses.forEach((resp) => {
                            allItems = [...allItems, ...resp];
                        });
                        let globalModifiers = {};
                        allItems.forEach((item) => {
                            globalModifiers = {
                                ...globalModifiers,
                                ...item.modifiers,
                            };
                            item.modifiers.primaryAttribute =
                                item?.modifiers?.strength ||
                                item?.modifiers?.intelligence ||
                                item?.modifiers?.agility ||
                                item?.modifiers?.wisdom;

                            if (item?.modifiers?.primaryAttribute) {
                                item.modifiers.primaryAttribute.displayname =
                                    'Primary Attribute';
                            }

                            // item.tier = item.tier || 'NONE';

                            console.log('effects', item.effect_list);
                            if (item.effect_list) {
                                let desc = '';
                                item.effect_list.forEach((effect) => {
                                    desc += effect.description + '<br></br>';
                                });

                                item.effectdesc = desc;
                            }
                        });
                        console.log(globalModifiers);
                        // console.log(allItems);
                        updateData(allItems);
                        addGridToWindow();
                        setFindingItems(false);
                        return;
                    })
                    .catch((err) => {
                        setFindingItems(false);
                        console.log(err);
                    });
            });
    };

    const sideBar = {
        toolPanels: ['columns', 'filters'],
        defaultToolPanel: 'columns',
        hiddenByDefault: false,
    };

    return (
        <div>
            <div id='filters'>
                {/* <div className='mb-3'>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className='btn btn-sm btn-secondary'
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div> */}
                {showFilters && (
                    <div>
                        <div className='row'>
                            {/* <div className='col-2'>
                    <label className='form-label'>Item Name</label>
                    <input
                        id='name'
                        name='name'
                        className='form-control'
                        type='text'
                        // style={{ width: '300px' }}
                    />
                </div> */}
                            <div className='col-2'>
                                <label className='form-label'>Class</label>
                                <select
                                    id='class'
                                    name='class'
                                    className='form-control'
                                    type='text'
                                    // style={{ width: '300px' }}
                                >
                                    <option value='assassin'>Assassin</option>
                                    <option value='beastlord'>Beastlord</option>
                                    <option value='berserker'>Berserker</option>
                                    <option value='brigand'>Brigand</option>
                                    <option value='bruiser'>Bruiser</option>
                                    <option value='channeler'>Channeler</option>
                                    <option value='coercer'>Coercer</option>
                                    <option value='conjuror'>Conjuror</option>
                                    <option value='defiler'>Defiler</option>
                                    <option value='dirge'>Dirge</option>
                                    <option value='fury'>Fury</option>
                                    <option value='guardian'>Guardian</option>
                                    <option value='illusionist'>
                                        Illusionist
                                    </option>
                                    <option value='inquisitor'>
                                        Inquisitor
                                    </option>
                                    <option value='monk'>Monk</option>
                                    <option value='mystic'>Mystic</option>
                                    <option value='necromancer'>
                                        Necromancer
                                    </option>
                                    <option value='paladin'>Paladin</option>
                                    <option value='ranger'>Ranger</option>
                                    <option value='shadowknight'>
                                        Shadowknight
                                    </option>
                                    <option value='swashbuckler'>
                                        Swashbuckler
                                    </option>
                                    <option value='templar'>Templar</option>
                                    <option value='troubador'>Troubador</option>
                                    <option value='warden'>Warden</option>
                                    <option value='warlock'>Warlock</option>
                                    <option value='wizard'>Wizard</option>
                                </select>
                            </div>
                            <div className='col-2'>
                                <label className='form-label'>Slot</label>
                                <select
                                    className='form-control'
                                    id='slot'
                                    name='slot'
                                >
                                    <option
                                        value=''
                                        selected='selected'
                                    ></option>
                                    <option value='Head'>Head</option>
                                    <option value='Cloak'>Cloak</option>
                                    <option value='Shoulders'>Shoulders</option>
                                    <option value='Chest'>Chest</option>
                                    <option value='Forearms'>Forearms</option>
                                    <option value='Hands'>Hands</option>
                                    <option value='Legs'>Legs</option>
                                    <option value='Feet'>Feet</option>
                                    <option value='Neck'>Neck</option>
                                    <option value='Ear'>Ear</option>
                                    <option value='Finger'>Finger</option>
                                    <option value='Wrist'>Wrist</option>
                                    <option value='Waist'>Waist</option>
                                    <option value='Charm'>Charm</option>
                                    <option selected value='Primary'>
                                        Primary
                                    </option>
                                    <option value='Secondary'>Secondary</option>
                                    <option value='Ranged'>Ranged</option>
                                    {/* <option value='Drink'>Drink</option>
                        <option value='Food'>Food</option>
                        <option value='Ammo'>Ammo</option>
                        <option value='Accolade'>Accolade (Merc)</option>
                        <option value='Saddle'>Saddle (Mount)</option>
                        <option value='Hackamore'>Hackamore (Mount)</option>
                        <option value='Reins'>Reins (Mount)</option>
                        <option value='Breeching'>Breeching (Mount)</option>
                        <option value='Shoes'>Shoes (Mount)</option>
                        <option value='Stirrup'>Stirrup (Mount)</option>
                        <option value='Barding'>Barding (Mount)</option> */}
                                </select>
                            </div>
                            <div className='col-1'>
                                <label className='form-label'>Min Level</label>
                                <select
                                    id='minlevel'
                                    name='minlevel'
                                    className='form-control'
                                    type='text'
                                    // style={{ width: '300px' }}
                                >
                                    {level.map((lev) => (
                                        <option
                                            selected={lev === 70}
                                            key={'min' + lev}
                                            value={lev}
                                        >
                                            {lev}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-1'>
                                <label className='form-label'>Max Level</label>
                                <select
                                    id='maxlevel'
                                    name='maxlevel'
                                    className='form-control'
                                    type='text'
                                    // style={{ width: '300px' }}
                                >
                                    {level.map((lev) => (
                                        <option
                                            selected={lev === 70}
                                            key={'max' + lev}
                                            value={lev}
                                        >
                                            {lev}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                style={{ height: '38px' }}
                                onClick={getData}
                                className='btn btn-sm btn-secondary align-self-end'
                            >
                                Find Items
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div
                id='myGrid'
                style={{
                    height: document.querySelector('#filters')
                        ? `calc(
                        100vh -
                            ${
                                document.querySelector('#filters')
                                    .offsetHeight + 'px'
                            } - 3rem
                    )`
                        : '',
                    minWidth: 100,
                }}
                className='ag-theme-alpine-dark mt-3'
            >
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        minWidth: 120,
                        filter: true,
                        sortable: true,
                        resizable: true,

                        // cellStyle: (params) => {
                        //     return { color: 'rgb(96, 216, 236)' };
                        // },
                    }}
                    sideBar={sideBar}
                    onGridReady={onGridReady}
                    animateRows={true}
                    rowData={rowData}
                    frameworkComponents={{ Tooltip: Tooltip }}
                    tooltipShowDelay={0}
                    tooltipMouseTrack={true}
                    sortingOrder={['desc', 'asc']}
                >
                    <AgGridColumn
                        field='displayname'
                        pinned='left'
                        enableValue={true}
                        cellStyle={dynamicCellStyle}
                        tooltipField='displayname'
                        headerName='Name'
                        tooltipComponent={'Tooltip'}
                        // tooltipComponentParams={{ color: '#ececec' }}
                        // cellRenderer={nameRenderer}
                    />

                    <AgGridColumn
                        field='gamelink'
                        enableValue={false}
                        hide={true}
                        headerName='Link'
                    />
                    <AgGridColumn
                        field='tier'
                        enableValue={true}
                        hide={true}
                        // cellStyle={dynamicCellStyle}
                    />
                    <AgGridColumn
                        field='effectdesc'
                        headerName='Effect'
                        enableValue={true}
                        // hide={true}
                        filter='agTextColumnFilter'
                        // cellRenderer={<div>test</div>}
                    />

                    <AgGridColumn
                        field='leveltouse'
                        headerName='Level'
                        minWidth='100'
                        enableValue={true}

                        // cellStyle={(params) => {
                        //     if (typeof params.value === 'number') {
                        //         return { 'text-align': 'right' };
                        //     } else {
                        //         return null;
                        //     }
                        // }}
                    />

                    {/* <AgGridColumn field='itemlevel' enableValue={false} /> */}
                    <AgGridColumn
                        field='modifiers.primaryAttribute.value'
                        headerName='Main Stat'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(61, 237, 61)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.stamina.value'
                        headerName='Stamina'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(61, 237, 61)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.combatskills.value'
                        headerName='Combat Skills'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(61, 237, 61)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.critchance.value'
                        headerName='Critical Chance'
                        minWidth='140'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.basemodifier.value'
                        headerName='Potency'
                        minWidth='100'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.spelltimecastpct.value'
                        headerName='Casting'
                        minWidth='100'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.spelltimereusepct.value'
                        headerName='Reuse'
                        minWidth='100'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.all.value'
                        headerName='Ability Mod'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />

                    {/* <AgGridColumn
                        field='modifiers.health.value'
                        headerName='Health'
                        enableValue={true}
                    /> */}
                    {/* <AgGridColumn
                        field='modifiers.mana.value'
                        headerName='Mana'
                        enableValue={true}
                    /> */}
                    <AgGridColumn
                        field='modifiers.dps.value'
                        headerName='DPS'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.attackspeed.value'
                        headerName='Haste'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.doubleattackchance.value'
                        headerName='Multi Attack'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.flurry.value'
                        headerName='Flurry'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.aeautoattackchance.value'
                        headerName='AE Auto'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />

                    {/* <AgGridColumn
                        field='modifiers.critbonus.value'
                        headerName='Crit Bonus'
                        enableValue={true}
                        
                    /> */}

                    <AgGridColumn
                        field='modifiers.maxhpperc.value'
                        headerName='Max HP'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.armormitigationincrease.value'
                        headerName='Mitigation'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='modifiers.blockchance.value'
                        headerName='Block'
                        enableValue={true}
                        cellStyle={(params) => {
                            return { color: 'rgb(96, 216, 236)' };
                        }}
                    />
                    <AgGridColumn
                        field='id'
                        enableValue={true}
                        // cellStyle={dynamicCellStyle}
                    />
                </AgGridReact>
            </div>
        </div>
    );
};
export default App;
