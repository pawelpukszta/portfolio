---
title: Resources
author: Paweł Pukszta
date: 2021-03-18
hero:
secret: true
slug: resources
---

## React Hooks

First released in October of 2018, the React hook APIs provide an alternative to writing class-based
components, and offer an alternative approach to state management and lifecycle methods. Hooks bring
to functional components the things we once were only able to do with classes, like being able to work
with React local state, effects and context through useState, useEffect and useContext.

### useToggle

This hook makes it easy to toggle a boolean value (true/false) in state. It also shows how useful useReducer can be, even for simple use-cases. If we were to utilize useState instead of useReducer then we'd need to create a second function for toggling the boolean value. We'd also need to wrap that second function with useCallback to unsure it has a stable identity. We don't need to worry about that with useReducer because the dispatch function it returns always has a stable identity.

```jsx
import React, { useReducer } from "react";

// Usage
function App() {
	const [isOn, toggleIsOn] = useToggle();

	return <button onClick={toggleIsOn}>Turn {isOn ? "Off" : "On"}</button>;
}

// Hook
function useToggle(initialValue = false) {
	// Returns the tuple [state, dispatch]
	// Normally with useReducer you pass a value to dispatch to indicate what action to
	// take on the state, but in this case there's only one action.
	return useReducer((state) => !state, initialValue);
}
```

### useWhyDidYouUpdate

This hook makes it easy to see which prop changes are causing a component to re-render. If a function is particularly expensive to run and you know it renders the same results given the same props you can use the React.memo higher order component, as we've done with the Counter component in the below example. In this case if you're still seeing re-renders that seem unnecessary you can drop in the useWhyDidYouUpdate hook and check your console to see which props changed between renders and view their previous/current values.

```jsx
import { useState, useEffect, useRef } from "react";

// Let's pretend this <Counter> component is expensive to re-render so ...
// ... we wrap with React.memo, but we're still seeing performance issues :/
// So we add useWhyDidYouUpdate and check our console to see what's going on.
const Counter = React.memo((props) => {
	useWhyDidYouUpdate("Counter", props);
	return <div style={props.style}>{props.count}</div>;
});

function App() {
	const [count, setCount] = useState(0);
	const [userId, setUserId] = useState(0);

	// Our console output tells use that the style prop for <Counter> ...
	// ... changes on every render, even when we only change userId state by ...
	// ... clicking the "switch user" button. Oh of course! That's because the
	// ... counterStyle object is being re-created on every render.
	// Thanks to our hook we figured this out and realized we should probably ...
	// ... move this object outside of the component body.
	const counterStyle = {
		fontSize: "3rem",
		color: "red",
	};

	return (
		<div>
			<div className='counter'>
				<Counter count={count} style={counterStyle} />
				<button onClick={() => setCount(count + 1)}>Increment</button>
			</div>
			<div className='user'>
				<img src={`http://i.pravatar.cc/80?img=${userId}`} />
				<button onClick={() => setUserId(userId + 1)}>
					Switch User
				</button>
			</div>
		</div>
	);
}

// Hook
function useWhyDidYouUpdate(name, props) {
	// Get a mutable ref object where we can store props ...
	// ... for comparison next time this hook runs.
	const previousProps = useRef();

	useEffect(() => {
		if (previousProps.current) {
			// Get all keys from previous and current props
			const allKeys = Object.keys({ ...previousProps.current, ...props });
			// Use this object to keep track of changed props
			const changesObj = {};
			// Iterate through keys
			allKeys.forEach((key) => {
				// If previous is different from current
				if (previousProps.current[key] !== props[key]) {
					// Add to changesObj
					changesObj[key] = {
						from: previousProps.current[key],
						to: props[key],
					};
				}
			});

			// If changesObj not empty then output to console
			if (Object.keys(changesObj).length) {
				console.log("[why-did-you-update]", name, changesObj);
			}
		}

		// Finally update previousProps with current props for next hook call
		previousProps.current = props;
	});
}
```

### useFetch

Useful hook if you want to fetch data.

```jsx
import React from "react";
//import useFetch from "./useFetch";

function App() {
	const { loading, response } = useFetch(
		"https://reqres.in/api/user/2?delay=1"
	);

	return (
		<>
			<h2>Get some data</h2>

			{loading ? (
				"Loading..."
			) : (
				<textarea rows='10' cols='50'>
					{JSON.stringify(response)}
				</textarea>
			)}
		</>
	);
}

// Hook
import { useState, useEffect } from "react";

const useFetch = (url) => {
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState();

	useEffect(() => {
		const fetchInfo = async () => {
			setLoading(true);
			try {
				const response = await fetch(url);
				const result = await response.json();
				setResponse(result);
			} catch (error) {
				setError(error);
			}
			setLoading(false);
		};

		fetchInfo();
	}, [url]);

	return { error, loading, response };
};

export default useFetch;
```

### useHover

Useful hook if you want to detect when the mouse is hovering an element.

```jsx
import React from "react";
//import useHover from "./useHover";

function App() {
	const [hoverRef, isHovered] = useHover();

	return <div ref={hoverRef}>{isHovered ? "Hovered !" : "Hover me !"}</div>;
}

// Hook
import { useEffect, useRef, useState } from "react";

const useHover = () => {
	const [value, setValue] = useState(false);
	const ref = useRef();

	const handleMouseOver = () => setValue(true);
	const handleMouseOut = () => setValue(false);

	useEffect(() => {
		const node = ref.current;

		if (node) {
			node.addEventListener("mouseover", handleMouseOver);
			node.addEventListener("mouseout", handleMouseOut);

			return () => {
				node.removeEventListener("mouseover", handleMouseOver);
				node.removeEventListener("mouseout", handleMouseOut);
			};
		}
	}, [ref.current]);

	return [ref, value];
};

export default useHover;
```

### useSlug

```jsx
import React from "react";
//import useSlug from "./useSlug";

function App() {
	const originalText = "Omégà! Pèlô? Fùl/ly";
	const sluggedText = useSlug(originalText);

	return (
		<>
			<div>Original text : {originalText}</div>
			<br />
			<div>Slugged text : {sluggedText}</div>
		</>
	);
}

// Hook
const useSlug = (string) => {
	const from = "àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœøṕŕßśșțùúüûǘẃẍÿź·/_,:;";
	const to = "aaaaaaaaceeeeghiiiimnnnooooooprssstuuuuuwxyz------";
	const regex = new RegExp(from.split("").join("|"), "g");

	return string
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(regex, (character) => to.charAt(from.indexOf(character)))
		.replace(/&/g, "-and-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
};

export default useSlug;
```
