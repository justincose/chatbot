import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'What is Poppy AI and what does it do?',
    message: 'What is Poppy AI and what does it do?'
  },
  {
    heading: 'Who founded Poppy AI?',
    message: 'Who founded Poppy AI (2024)?'
  },
  {
    heading: 'What makes Poppy AI different from other AI companies?',
    message: 'What makes Poppy AI different from other AI companies?'
  },
  {
    heading: 'What are some potential use cases for Poppy AI?',
    message: 'What are some potential use cases for Poppy AI?'
  }
]

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-2 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
