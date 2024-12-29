


export const showAlert = (error) => {
  alert(error?.message || JSON.stringify(error))
}