import {Container} from "./Container";

export default function MenuBar(props) {
    return (
        <Container>
            {props.children}
        </Container>
    );
}