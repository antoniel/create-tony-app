import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from '@ui-sdk/react/file-input'

export default function FileUpload() {
  return (
    <FileInput className="sdk-stack" multiple>
      <FileInputDropzone className="sdk-dropzone">Drop files here</FileInputDropzone>
      <FileInputTrigger className="sdk-button">Choose files</FileInputTrigger>
      <FileInputList className="sdk-list sdk-stack">
        <FileInputItem className="sdk-row">
          {({ file }) => (
            <>
              <span>{file.name}</span>
              <FileInputItemRemove className="sdk-button" aria-label={`Remove ${file.name}`}>
                ×
              </FileInputItemRemove>
            </>
          )}
        </FileInputItem>
      </FileInputList>
    </FileInput>
  )
}
