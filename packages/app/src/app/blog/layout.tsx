import React from 'react';

type BlogLayoutProps = {
    children: React.ReactNode;
};

const BlogLayout = ({ children }: BlogLayoutProps) => {
    return (
        <div>
            <h2>This is the Blog Layout</h2>
            {children}
        </div>
    );
}

export default BlogLayout;