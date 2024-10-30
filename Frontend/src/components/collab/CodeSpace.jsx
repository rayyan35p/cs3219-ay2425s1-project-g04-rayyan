import React from 'react'
import { Editor } from '@monaco-editor/react'
import { Container, Stack } from 'react-bootstrap'

const CodeSpace = ({ handleEditorChange, code, language, output }) => {
  return (

    <Stack gap={3} className='h-100'>
        <Editor
            height='400px'
            defaultLanguage="python"
            language={language}
            value={code}
            onChange={handleEditorChange}
            theme='vs-dark'
        />
        <Container style={{ height: '200px', border: '1px solid #ccc', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#f8f9fa'}}>
            <h5>Output</h5>
            <p style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}>{output}</p>
        </Container>
    </Stack>
    
  )
}

export default CodeSpace