import api from "../../../utils/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./AddPet.module.css";
import PetForm from "../../form/PetForm";
import useFlashMessage from "../../../hooks/useFlashMessage";

function EditPet() {
  const { id } = useParams();
  const [pet, setPet] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setPet(response.data.pet);
      });
  }, [token, id]);

  async function updatePet(pet) {
    let msgType = "success";
    const formData = new FormData();

    for (const key in pet) {
      if (pet.hasOwnProperty(key)) {
        if (key === "images" && pet[key].length > 0) {
          for (let i = 0; i < pet[key].length; i++) {
            formData.append("images", pet[key][i]);
          }
        } else {
          formData.append(key, pet[key]);
        }
      }
    }

    try {
      const response = await api.patch(`pets/${pet._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFlashMessage(response.data.message, msgType);
    } catch (error) {
      console.error(error);
      msgType = "error";
      setFlashMessage(error.response.data.message, msgType);
    }
  }

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando o Pet: {pet.name}</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
      </div>
      {pet.name && (
        <PetForm handleSubmit={updatePet} petData={pet} btnText="Editar" />
      )}
    </section>
  );
}

export default EditPet;
