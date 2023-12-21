import { Box, Dialog, Slide } from '@mui/material';
import { forwardRef } from 'react';
import Scrollbar from 'src/components/scrollbar';
import useResponsive from 'src/hooks/useResponsive';
import { MEDIUM_MODAL } from 'src/utils/constant';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function VideoModal({ open, onClose, referenceData }) {
    const isDesktop = useResponsive('up', 'lg');

    return (
        <>
            <Dialog
                TransitionComponent={Transition}
                fullWidth
                maxWidth={MEDIUM_MODAL}
                open={open}
                onClose={() => onClose({ status: false, data: '' })}
                sx={{ '& .MuiPaper-root': { width: '100%' } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <Box
                        sx={{ overflow: 'hidden' }}
                        display="flex"
                        flexDirection={'column'}
                        gap={1}
                        flex={1}
                        minHeight={0}
                    >
                        <Box display={'flex'} sx={{ overflow: 'hidden', flex: 1 }}>
                            <Scrollbar sx={{ flex: 1, height: '100%', p: 2, pb: 1.25 }}>
                                {referenceData.video_type == '1' ? (
                                    <iframe
                                        height={isDesktop ? '550' : '250'}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        style={{
                                            width: '100%',
                                            border: 0,
                                            borderRadius: 4,
                                        }}
                                        src={referenceData.video_link}
                                        poster={referenceData.media_url}
                                        autoPlay
                                    ></iframe>
                                ) : (
                                    <video
                                        src={referenceData.video_link}
                                        poster={referenceData.media_url}
                                        controls
                                        style={{
                                            height: isDesktop ? 550 : 250,
                                            borderRadius: 4,
                                            width: '100%',
                                            objectFit: 'cover',
                                        }}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </Scrollbar>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}
