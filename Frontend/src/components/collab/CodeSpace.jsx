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
        <Container style={{ height: '225px', border: '1px solid #ccc', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#f8f9fa', padding: '20px'}}>
            <h4>Output</h4>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-1">Running...</span>
              </div>
            ): (
              <div style={{ maxHeight: '150px', overflowY: 'auto', fontFamily: 'monospace', whiteSpace: 'pre-wrap', border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '0.5rem'}}>
                <p>{output}</p>
              </div>
            )}
        </Container>
    </Stack>
    
  )
}

export default CodeSpace