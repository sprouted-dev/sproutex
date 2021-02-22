import React, {useState} from "react";
import {Form} from "react-bootstrap";

const DepositWithdrawForm = ({saveChanges, actionLabel, actionPlaceholder}) => {

  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    saveChanges({amount});
  }

  const handleInputChange = (e) => {
    const {value} = e.target;
    setAmount(value);
  }

  return (
    <Form className="row" onSubmit={handleSubmit}>
      <div className="col-12 col-sm pr-sm-2">
        <input type="text"
               placeholder={actionPlaceholder}
               onChange={handleInputChange}
               className="form-control form-control-sm bg-dark text-white"
               required
        />
      </div>
      <div className="col-12 col-sm-auto pl-sm-0">
        <button type="submit" className="btn btn-primary btn-block btn-sm">{actionLabel}</button>
      </div>
    </Form>
  )
}

export default DepositWithdrawForm;