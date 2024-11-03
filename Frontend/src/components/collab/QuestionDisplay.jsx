import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'

const QuestionDisplay = ({ title, description}) => {

  return (
    <Card>
      <Card.Header>{title || "Loading..."}</Card.Header>
      <Card.Body>
        <p>{description || "Loading question details..."}</p>
      </Card.Body>
    </Card>
  )
}

export default QuestionDisplay
