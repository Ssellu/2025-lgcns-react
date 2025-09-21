import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    Grid
} from '@mui/material';

function Ex08MUICardExample() {
    const cards = [
        {
            title: 'React 프론트엔드',
            description: '현대적인 웹 애플리케이션을 구축하는 최고의 JavaScript 라이브러리입니다.',
            image: 'https://picsum.photos/300/200?random=1'
        },
        {
            title: 'MUI 디자인 시스템',
            description: 'Material Design 기반의 강력하고 아름다운 React 컴포넌트 라이브러리입니다.',
            image: 'https://picsum.photos/300/200?random=2'
        },
        {
            title: '반응형 웹 디자인',
            description: '모든 디바이스에서 완벽하게 동작하는 아름답고 직관적인 사용자 인터페이스입니다.',
            image: 'https://picsum.photos/300/200?random=3'
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h3>MUI Card 예제</h3>
            <Grid container spacing={3}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={card.image}
                                alt={card.title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">공유</Button>
                                <Button size="small">더보기</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Ex08MUICardExample;