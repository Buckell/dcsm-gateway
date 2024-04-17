import {Container} from "./Container";

export default function Menu(props) {
    return (
        <Container>
            <p>
                {props.title}
            </p>
        </Container>
    );
}