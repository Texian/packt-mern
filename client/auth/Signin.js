export default function Signin(props) {
    const [values, setValues] = useState({
        email:'',
        password:'',
        error:'',
        redirectToReferrer: false
    })

    const clickSubmit = () => {
        const user = {
            email: values.email || undefined,
            password: values.password || undefined
        }

        signin(user).then((data) => {
            if (data.error) {
                setValues({...values, error: data.error})
            } else {
                auth.authenticate(data, () => {
                    setValues({...values, error: '',redirectToReferrer: true})
                })
            }
        })
    }

    const {from} = props.location.state || {
        from: {
            pathname: '/'
        }
    }
    const {redirectToReferrer} = values
    if (redirectToReferrer) {
        return (<Redirect to={from}/>)
    }

    return (
        <div>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Sign In
                    </Typography>
                    <TextField id="email" type="email" label="Email"
                        className={classes.textField}
                        value={values.email} onChange={handleChange('email')}
                        margin="normal" />
                    <br />
                    <TextField id="password" type="password" label="Password"
                        className={classes.textField}
                        value={values.password} onChange={handleChange('password')}
                        margin="normal" />
                    <br />
                    {
                        values.error && (<Typography component="p" color="error">
                            <Icon color="error" className={classes.error}>error</Icon>
                            {values.error}
                        </Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={clickSubmit}
                        className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
        </div>
    )
}