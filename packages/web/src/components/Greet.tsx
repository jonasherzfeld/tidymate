import React from "react";

type GreetProps = {
    name: string;
};

export const Greet = (props: GreetProps) => {
    return (
        <div>
            <h1>Hi there {props.name} !</h1>
            <p>How are you doing?</p>
        </div>
    );
};
