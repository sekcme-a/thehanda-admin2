import { supabase } from "@lib/supabase";




export const uploadFilesAndGetPublicUrls = async (images, folder, path) => {
  try {
    const uploadPromises = images.map(async (item, index) => {
      const filePath =  `${path}/${index}_${item.name}`;

      // Try to delete the file if it already exists
      await supabase.storage.from(folder).remove([filePath]);

      // Upload the new file
      const { data: storageData, error: storageError } = await supabase.storage
        .from(folder)
        .upload(filePath, item.data);

      if (storageError) {
        throw new Error(storageError);
      }

      const { data: urlData, error: urlError } = await supabase
        .storage
        .from("images")
        .getPublicUrl(storageData.path);

      if (urlError) {
        throw new Error(urlError);
      }
      return urlData.publicUrl;
    });

    const uploadedList = await Promise.all(uploadPromises);
    return {data: uploadedList};
  } catch (error) {
    return {error: error};
  }
}


export const deleteFilesWithPublicUrl = async (urls) => {
  try {
    // Iterate over each URL
    for (const url of urls) {
      // Extract the path from the URL
      const urlObj = new URL(url);
      const path = urlObj.pathname.replace('/storage/v1/object/public/', '');

      // Extract bucket name and file path
      const [bucketName, ...filePathParts] = path.split('/');
      const filePath = filePathParts.join('/');

      // Delete the file
      const { error } = await supabase
        .storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(error)
      }
    }
    return {data: true}
  } catch (error) {
    return {error: error}
  }
};


export const deleteFolder = async (bucketName, folderPath) => {
  try{
    const {data, error} = await supabase.storage
      .from(bucketName)
      .list(folderPath)
   if(error) throw error
  
   for (const file of data){
    const filePath = `${folderPath}/${file.name}`
    await supabase.storage.from(bucketName).remove(filePath)
   }
   return true
  }catch(e) {
    console.log(e)
    return false
  }
}