import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TextEditor = ({ onContentChange }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleEditorStateChange = (editorState) => {
        setEditorState(editorState);
        const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        onContentChange(contentHtml); // Pass the content up to the parent component
    };

    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={handleEditorStateChange}
            />
            <textarea
                disabled
                value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            ></textarea>
        </div>
    );
};

export default TextEditor;
