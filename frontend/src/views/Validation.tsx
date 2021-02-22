import React, { useCallback, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { validateImage } from "../api/imageValidation";

const Validation: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await validateImage(imageUrl);
    },
    [imageUrl]
  );

  return (
    <div className="common-content-box">
      <Row>
        <Col>
          <h3>Validation</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter image url"
                value={imageUrl}
                onChange={({ target }) => setImageUrl(target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Validation;
