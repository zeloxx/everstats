import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { attributes, classes, dynamicCellStyle } from './helpers/helpers';

export default forwardRef((props, ref) => {
    // eslint-disable-next-line
    const [data, setData] = useState(
        props.api.getDisplayedRowAtIndex(props.rowIndex).data
    );

    useImperativeHandle(ref, () => {
        return {
            getReactContainerClasses() {
                return ['custom-tooltip-container'];
            },
        };
    });

    const capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const renderWeaponStatsOrOther = () => {
        if (data?.typeinfo?.name === 'weapon') {
            return (
                <div>
                    <div style={{ fontWeight: '700' }}>
                        {capitalize(data?.requiredskill?.text)}
                    </div>
                    <div>
                        {data.typeinfo.wieldstyle}{' '}
                        {capitalize(data.typeinfo.skill)}
                    </div>
                    <div className='row'>
                        <span className='col-4'>Damage</span>
                        <span className='col-4'>
                            {data.typeinfo.mindamage} -{' '}
                            {data.typeinfo.maxdamage}
                        </span>
                        <span className='col-4'>
                            (
                            {Math.round(data.typeinfo.damagerating * 100) / 100}{' '}
                            Rating)
                        </span>
                    </div>
                    <div className='row'>
                        <span className='col-4'>Delay</span>
                        <span className='col-4'>
                            {' '}
                            {data.typeinfo.delay.toFixed(1)} seconds
                        </span>
                    </div>
                    <div className='row'>
                        <span className='col-4'>Level</span>
                        <span
                            className='col-4'
                            style={{ color: 'rgb(61, 237, 61)' }}
                        >
                            {data.leveltouse}
                        </span>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className='row'>
                        <div className='col-2'>
                            {data.slot_list.length > 1 ? 'Slots' : 'Slot'}
                        </div>
                        <div className='col-2'>
                            {data.slot_list.map((slot) => slot.name).join(', ')}
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-2'>Level</div>
                        <div
                            className='col-2'
                            style={{ color: 'rgb(61, 237, 61)' }}
                        >
                            {data.leveltouse}
                        </div>
                    </div>
                </div>
            );
        }
    };

    const renderClasses = () => {
        const counts = { fighters: 0, priests: 0, mages: 0, scouts: 0 };

        const classnames = Object.keys(data.typeinfo.classes);

        classnames.forEach((classname) => {
            if (classes[classname]?.type === 'fighter') {
                counts.fighters += 1;
            } else if (classes[classname]?.type === 'mage') {
                counts.mages += 1;
            } else if (classes[classname]?.type === 'priest') {
                counts.priests += 1;
            } else if (classes[classname]?.type === 'scout') {
                counts.scouts += 1;
            }
        });

        const list = [];

        if (counts.fighters === 6) {
            list.push('All Fighters');
        }
        if (counts.mages === 6) {
            list.push('All Mages');
        }
        if (counts.priests === 7) {
            list.push('All Priests');
        }
        if (counts.scouts === 7) {
            list.push('All Scouts');
        }

        const sublist = [];

        classnames.forEach((classname) => {
            if (
                classes[classname]?.type === 'fighter' &&
                counts.fighters !== 6
            ) {
                sublist.push(data.typeinfo.classes[classname].displayname);
            }
            if (classes[classname]?.type === 'mage' && counts.mages !== 6) {
                sublist.push(data.typeinfo.classes[classname].displayname);
            }
            if (classes[classname]?.type === 'priest' && counts.priests !== 7) {
                sublist.push(data.typeinfo.classes[classname].displayname);
            }
            if (classes[classname]?.type === 'scout' && counts.scouts !== 7) {
                sublist.push(data.typeinfo.classes[classname].displayname);
            }
        });

        sublist.sort();

        return (
            <div className='mt-2' style={{ color: 'rgb(61, 237, 61)' }}>
                {[...list, ...sublist].join(', ')}
            </div>
        );
    };

    const renderEffect = () => {
        let noIndentCount = 0;

        if (data?.effect_list?.length > 0) {
            return (
                <div>
                    <div
                        className='mt-3'
                        style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: 'rgb(218, 220, 116)',
                        }}
                    >
                        Effects:
                    </div>
                    {data.effect_list.map((effect, i) => {
                        let idx;
                        if (effect.indentation === 0) {
                            idx = noIndentCount;
                            noIndentCount += 1;
                        }
                        return (
                            <div key={`effect-${i}`}>
                                {effect.indentation === 0 ? (
                                    <div>
                                        <div
                                            className={`${i !== 0 && 'mt-2'}`}
                                            style={dynamicCellStyle({
                                                data: { tier: data.tier },
                                            })}
                                        >
                                            {data.adornment_list[idx].name}
                                        </div>
                                        <div>{effect.description}</div>
                                    </div>
                                ) : (
                                    <div className='d-flex'>
                                        {effect.indentation > 0 && (
                                            <div
                                                className='d-flex justify-content-end align-items-baseline'
                                                style={{
                                                    minWidth:
                                                        effect.indentation *
                                                            20 +
                                                        'px',
                                                }}
                                            >
                                                {/* <div
                                                    style={{
                                                        paddingLeft:
                                                            effect.indentation *
                                                                20 +
                                                            'px',
                                                        2,
                                                    }}
                                                > */}
                                                <div
                                                    style={{
                                                        minWidth: '4px',
                                                        minHeight: '4px',
                                                        marginTop: '8px',
                                                        borderRadius: '100%',
                                                        marginRight: '5px',
                                                        backgroundColor:
                                                            '#efea77',
                                                        display: 'inline-block',
                                                    }}
                                                ></div>
                                                {/* </div> */}
                                            </div>
                                        )}
                                        <span>{effect.description}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }
    };

    return (
        <div style={{ minHeight: '1000px' }}>
            <div className='custom-tooltip-container'>
                <div className='custom-tooltip'>
                    <div className='custom-tooltip-inner'>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <div style={{ fontWeight: 700 }}>
                                    {data.displayname}
                                </div>
                                <div
                                    style={dynamicCellStyle({
                                        data: { tier: data.tier },
                                    })}
                                >
                                    {data.tier}
                                </div>
                            </div>
                            <div className='item-icon'>
                                <img
                                    src={`http://census.daybreakgames.com/img/eq2/icons/${data.iconid}/item/`}
                                    alt="Icon"
                                />
                            </div>
                        </div>
                        {Object.keys(data.modifiers).length > 1 && (
                            <div className='row mt-2'>
                                {Object.keys(data.modifiers).map(
                                    (attribute) => {
                                        if (
                                            attributes?.[attribute]?.color ===
                                            'green'
                                        ) {
                                            return (
                                                <div className='col-6'>
                                                    <div
                                                        style={{
                                                            fontSize: '13px',
                                                            fontWeight: 700,
                                                            color:
                                                                'rgb(61, 237, 61)',
                                                            display:
                                                                'inline-block',
                                                        }}
                                                    >
                                                        {
                                                            data.modifiers[
                                                                attribute
                                                            ].value
                                                        }{' '}
                                                        {
                                                            attributes[
                                                                attribute
                                                            ].displayname
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }
                                    }
                                )}
                            </div>
                        )}
                        {Object.keys(data.modifiers).length > 1 && (
                            <div className='row mt-2 mb-3'>
                                {Object.keys(data.modifiers).map(
                                    (attribute) => {
                                        if (
                                            attributes?.[attribute]?.color ===
                                            'blue'
                                        ) {
                                            return (
                                                <div className='col-6'>
                                                    <div
                                                        style={{
                                                            fontSize: '13px',
                                                            fontWeight: 700,
                                                            color:
                                                                'rgb(96, 216, 236)',
                                                            display:
                                                                'inline-block',
                                                        }}
                                                    >
                                                        {
                                                            data.modifiers[
                                                                attribute
                                                            ].value
                                                        }{' '}
                                                        {
                                                            attributes[
                                                                attribute
                                                            ].displayname
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }
                                    }
                                )}
                            </div>
                        )}
                        {renderWeaponStatsOrOther()}
                        {renderClasses()}
                        {renderEffect()}
                    </div>
                </div>
            </div>
        </div>
    );
});
