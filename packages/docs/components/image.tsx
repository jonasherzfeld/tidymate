interface ImageProps {
    children?: React.ReactNode
    alt?: string
    src: string
}

const Image: React.FC<ImageProps> = ({
    children,
    alt = 'Image Alt',
    src
}) => {
    return (
        <img alt={alt} src={(process.env.NEXT_PUBLIC_BASE_PATH || '') + src} />
    )
}

export default Image
