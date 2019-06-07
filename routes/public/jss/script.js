const check=function()
{
    const hold=document.getElementById("inputPassword").value;
    const check=document.getElementById("confirmpassword").value;
    if(hold===check)
    {
        document.getElementById('warn').innerText=''
    }
    else
    {
        document.getElementById('warn').innerText='password not matched'
    }
}