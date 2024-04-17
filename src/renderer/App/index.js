import { useEffect, useState } from 'react';

import { Background } from '../gade/Background';
import MenuBar from '../gade/MenuBar';
import { MenuIcon } from '../gade/MenuBar/MenuIcon';
import Input from '../gade/Input';
import Typography from '../gade/Typography';
import List from '../gade/List';
import ListItem from '../gade/List/ListItem';
import Dropdown from '../gade/Dropdown';
import DropdownItem from '../gade/Dropdown/DropdownItem';
import GADE from '../gade/gade';
import Button from '../gade/Button';

import Icon from './assets/logo.svg';
import '../gade/fonts.css';

export default function App() {
    document.title = 'DCSM Gateway';

    const [selected, setSelected] = useState(['', 0]);
    const [devices, setDevices] = useState([]);
    const [gateways, setGateways] = useState([]);

    const [active, setActive] = useState(false);
    const [method, setMethod] = useState('');
    const [universe, setUniverse] = useState('');
    const [net, setNet] = useState('');
    const [subnet, setSubnet] = useState('');

    useEffect(() => {
        const currentGateway = gateways.filter(
            (g) => g.device === selected[0] && g.port === selected[1],
        )?.[0];

        if (currentGateway && currentGateway.method !== '') {
            setActive(true);
            setMethod(currentGateway.method);
            setUniverse(currentGateway.universe);
            setNet(currentGateway.net);
            setSubnet(currentGateway.subnet);
        } else {
            setActive(false);
            setMethod('');
            setUniverse('1');
            setNet('0');
            setSubnet('0');
        }
    }, [gateways, selected, selected.device, selected.port]);

    const connectDevices = () => {
        GADE.call('Gateway.ConnectDevices').then(() => {
            GADE.call('Gateway.GetDevices').then(setDevices);
        });
    };

    const refreshGateways = () => {
        GADE.call('Gateway.GetGateways').then((g) => {
            setGateways(g);
            return g;
        });
    };

    const select = (device, port) => {
        setSelected([device, port]);
        refreshGateways();
    };

    const setGateway = () => {
        const universeNumber = parseInt(universe, 10);
        const netNumber = parseInt(net, 10);
        const subnetNumber = parseInt(subnet, 10);

        if (
            !['sACN', 'ArtNet'].includes(method) ||
            Number.isNaN(universeNumber)
        ) {
            return;
        }

        GADE.call('Gateway.SetGateway', {
            device: selected[0],
            port: selected[1],
            method,
            universe: universeNumber,
            net: netNumber,
            subnet: subnetNumber,
        }).then(refreshGateways);
    };

    const stopGateway = () => {
        GADE.call('Gateway.SetGateway', {
            device: selected[0],
            port: selected[1],
            method: '',
        }).then(refreshGateways);
    };

    return (
        <Background>
            <MenuBar>
                <MenuIcon src={Icon} />
            </MenuBar>

            <List
                style={{
                    position: 'absolute',
                    top: '40px',
                    left: 0,
                    bottom: 0,
                    width: '170px',
                }}
            >
                {devices.map((device) => (
                    <>
                        <ListItem
                            style={{
                                borderBottom: 'solid 1px #77777755',
                                borderTop: 'solid 1px #77777755',
                            }}
                        >
                            <Typography
                                fontWeight="500"
                                fontSize="12pt"
                                margin="5px 0 0 5px"
                            >
                                {device.name}
                            </Typography>
                            <Typography
                                fontSize="9pt"
                                margin="2px 0 7px 5px"
                                color="#ccc"
                            >
                                {device.port}
                            </Typography>
                        </ListItem>
                        {device.ports.map((port) => {
                            const [selectedDevice, selectedPort] = selected;

                            if (port) {
                                return (
                                    <ListItem
                                        onClick={() =>
                                            select(device.port, port.port)
                                        }
                                        selected={
                                            selectedDevice === device.port &&
                                            selectedPort === port.port
                                        }
                                        selectable
                                    >
                                        <Typography
                                            fontSize="10pt"
                                            margin="10px 0 15px 20px"
                                            color="#eee"
                                        >
                                            Port {port.port}
                                        </Typography>
                                    </ListItem>
                                );
                            }

                            return null;
                        })}
                    </>
                ))}
            </List>

            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    height: '50px',
                    width: '170px',
                    background: '#212526',
                }}
            >
                <Button
                    style={{
                        display: 'block',
                        margin: '10px auto',
                        width: '150px',
                    }}
                    onClick={connectDevices}
                >
                    Connect Devices
                </Button>
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: '40px',
                    left: '200px',
                    right: 0,
                    bottom: 0,
                    padding: '20px',
                }}
            >
                {selected[1] !== 0 && (
                    <>
                        <Typography
                            fontWeight="500"
                            fontSize="20px"
                            marginTop="0"
                        >
                            Port {selected[1]}
                        </Typography>

                        <Dropdown
                            label="Method"
                            placeholder="Method"
                            onChange={setMethod}
                            value={method}
                            disabled={active}
                        >
                            <DropdownItem label="sACN" />
                            <DropdownItem label="ArtNet" />
                        </Dropdown>

                        <Input
                            label="Universe"
                            placeholder="Universe"
                            value={universe}
                            onChange={(e) => setUniverse(e.target.value)}
                            disabled={active}
                        />

                        {method === 'ArtNet' && (
                            <>
                                <Input
                                    label="Net"
                                    placeholder="Net"
                                    value={net}
                                    onChange={(e) => setNet(e.target.value)}
                                    disabled={active}
                                />
                                <Input
                                    label="Subnet"
                                    placeholder="Subnet"
                                    value={subnet}
                                    onChange={(e) => setSubnet(e.target.value)}
                                    disabled={active}
                                />
                            </>
                        )}

                        <Button
                            style={{
                                marginTop: '10px',
                            }}
                            onClick={active ? stopGateway : setGateway}
                        >
                            {active ? 'Stop' : 'Set'}
                        </Button>
                    </>
                )}
            </div>
        </Background>
    );
}
