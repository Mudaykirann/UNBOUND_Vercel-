// ProseMirrorEditor.js
import { useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { baseKeymap } from 'prosemirror-commands';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { exampleSetup } from 'prosemirror-example-setup'; // Comment this out if not found

// Mix the nodes from prosemirror-schema-list into the basic schema
const mySchema = new Schema({
    nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block'),
    marks: basicSchema.spec.marks,
});

const ProseMirrorEditor = ({ content, onChange }) => {
    const editorRef = useRef(null);
    const viewRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) {
            const plugins = [
                keymap(baseKeymap),
                history(),
                keymap({
                    'Mod-z': undo,
                    'Mod-y': redo,
                }),
                // Add more plugins as needed
            ];

            const state = EditorState.create({
                doc: DOMParser.fromSchema(mySchema).parse(content || '<p></p>'),
                plugins: [...exampleSetup({ schema: mySchema }), ...plugins],
            });

            viewRef.current = new EditorView(editorRef.current, {
                state,
                dispatchTransaction(transaction) {
                    const newState = viewRef.current.state.apply(transaction);
                    viewRef.current.updateState(newState);
                    if (onChange) {
                        onChange(newState.doc.toJSON());
                    }
                },
            });
        }

        // Cleanup on unmount
        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
            }
        };
    }, [content, onChange]);

    return <div ref={editorRef} id="editor" />;
};

export default ProseMirrorEditor;
