<template>
  <div>
    <div class="mb-4">
      <UFormGroup label="Current avatar" class="w-full" help="This would be blank by default">
        <UAvatar :src="url" size="3xl" />
      </UFormGroup>
    </div>
    <div class="mb-4">
      <UFormGroup label="New avatar" class="w-full" name="avatar"
        help="After choosing an image click Save to actually upload the new avatar">
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>
    <UButton type="submit" color="black" variant="solid" label="Save" :loading="uploading" :disabled="uploading"
      @click="saveAvatar" />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { url } = useAvatarUrl()
const { toastSuccess, toastError } = useAppToast()

const uploading = ref(false)
const fileInput = ref() 

const saveAvatar = async () => {
  // 1. Ottieni il file caricato
  //    a) Se nessun file è stato caricato, mostra un errore
  const file = fileInput.value.input.files[0]
  if (!file) {
    toastError({ title: 'Select a file to upload first'})
    return
  }

  // Crea un nome unico casuale
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random()}.${fileExt}`

  try {
    uploading.value = true
    // 1. Ottieni l'URL corrente dell'avatar
    const currentAvatarUrl = user.value.user_metadata?.avatar_url
    
    // 2. Carica l'immagine nel bucket degli avatar
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)
      
    if (error) throw error

    // 3. Aggiorna i metadati dell'utente con l'URL dell'avatar
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName
      }
    })

    // 4. Rimuovi il vecchio file avatar
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([currentAvatarUrl])
      if (error) throw error
    }

    // 5. Resetta l'input del file
    fileInput.value.input.value = null
      
    toastSuccess({
      title: 'Avatar uploaded',
    })
  } catch (error) {
    toastError({
      title: 'Error uploading avatar',
      description: error.message
    })
  } finally {
    uploading.value = false
  }
}
</script>