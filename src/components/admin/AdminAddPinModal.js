// AdminAddPinModal.js
import React, { createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Button, Modal } from "react-bootstrap";
import AdminFormFields from "./AdminFormFields";
import { updateDatabase } from "../../redux/Actions";

// Create a context for the form data
const FormDataContext = createContext();

// Create a custom hook to use the form data context
function useFormData() {
  return useContext(FormDataContext);
}

function AdminAddPinModal({
  mode,
  handleConfirm,
  handleCancel,
  coordinates,
  map,
}) {
  const {
    register,
    handleSubmit,
    formState,
    control,
    setValue,
    watch,
    getValues,
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    // Get all the form values
    const allData = getValues();

    // Create a new pin object with the form data and the coordinates
    const newPin = {
      ...allData,
      coordinates: [coordinates.lng, coordinates.lat],
    };
    // Dispatch the updateDatabase action with the new pin
    dispatch(updateDatabase("pins", newPin));
    // Reset the form
    reset();
    // Close the modal
    handleCancel();
  };

  return (
    <Modal show={mode === "add"} onHide={handleCancel}>
      <form onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}>
        <Modal.Header closeButton onHide={handleCancel}>
          <Modal.Title style={{ textAlign: "center" }}>
            Add a new pin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AdminFormFields
            register={register}
            formState={formState}
            control={control}
            setValue={setValue}
            watch={watch}
            getValues={getValues}
            reset={reset}
            map={map}
            coordinates={coordinates}
          />
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export { useFormData };
export default AdminAddPinModal;
