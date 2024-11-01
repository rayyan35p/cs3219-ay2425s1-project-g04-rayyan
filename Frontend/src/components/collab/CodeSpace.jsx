import React from 'react'
import { Editor } from '@monaco-editor/react'
import { Container, Stack, Spinner } from 'react-bootstrap'

const CodeSpace = ({ handleEditorChange, loading, code, language, output }) => {
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
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-1">Running...</span>
              </div>
            ): (
              <p style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}>{output}</p>
            )}
        </Container>
    </Stack>
    
  )
}

export default CodeSpace