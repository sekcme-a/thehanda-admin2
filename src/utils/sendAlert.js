


export const sendAlert = (error) => {
  alert(error?.message || JSON.stringify(error))
}